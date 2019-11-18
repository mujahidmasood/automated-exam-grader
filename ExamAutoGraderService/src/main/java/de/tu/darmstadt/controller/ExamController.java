package de.tu.darmstadt.controller;

import de.tu.darmstadt.entitiy.*;
import de.tu.darmstadt.repositories.ExamGradeRepository;
import de.tu.darmstadt.repositories.ExamRepository;
import de.tu.darmstadt.services.StorageService;
import de.tu.darmstadt.util.ApplicationConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.util.DateUtils;
import org.thymeleaf.util.StringUtils;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * This controller provides exam related rest end points to be used by ExamGraderUi
 *
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/exam")
public class ExamController {

    @Autowired
    ExamRepository examRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    StorageService storageService;

    @Autowired
    ExamGradeRepository examGradeRepository;

    private double totalPoints = 0;

    /**
     * Creates new Exam in the database
     * @param exam input fields filled from ExamGraderUi
     * @return created exam, status 200 if success, otherwise failure statuses.
     */
    @PostMapping("addExam")
    public ResponseEntity<Exam> addExam(@RequestBody Exam exam) {
        Exam exam1 = examRepository.save(exam);
        if (exam1 != null) {
            return new ResponseEntity<>(exam1, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    /**
     * Gets the list of unprocessed exams from the database.
     *
     * @return List of unprocessed exams
     */
    @GetMapping("getUnprocessedSheets")
    public ResponseEntity<List<Exam>> getUnprocessedSheets() {
        List<Exam> unProcessedExams = examRepository.findAllByProcessed("false");
        if (!unProcessedExams.isEmpty()) {
            return new ResponseEntity<>(unProcessedExams, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    /**
     * Saves the Exam Processing Configs in database.
     *
     * @param exam
     * @return saved entity in database
     */
    @PostMapping("saveProcessingData")
    public ResponseEntity<Exam> saveProcessingData(@RequestBody Exam exam) {

        if (mongoTemplate != null) {
            Exam examToUpdate = mongoTemplate.findOne(Query.query(Criteria.where("_id").is(exam.getId())), Exam.class);
            if (examToUpdate != null) {
                examToUpdate.setProcessingMode(exam.getProcessingMode());
                examToUpdate.setProcessingDate(exam.getProcessingDate());
                examToUpdate.setProcessingTime(exam.getProcessingTime());
                examToUpdate.setInputExamSheetsDirectory(exam.getInputExamSheetsDirectory());

                Exam savedExam = examRepository.save(examToUpdate);
                if (savedExam != null) {
                    return new ResponseEntity<>(savedExam, HttpStatus.OK);
                }
            }
        }

        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    /**
     * This is the scheduled task which run every 10 minutes to check if there are any exams available to be processed.
     * If there are any un processed exams, their details are fetched from database including questions, possible answers, exam sheet directory, coordinates to extract text from.
     * The information of images and coordinates is sent to ExamAutoGraderProcessor via rest calls and extracted text from coordinates is sent in the response.
     * Extracted answer is compared to answer in database and points are calculated.
     *
     * If user wants to increase the time he can change the number from 10 to 20 or 30 for example or 60 in case of hour.
     */
    @Scheduled(fixedRate = 1 * 60000)
    public void processExamSheets() {
        Date date = new Date();
        String processingDate = DateUtils.format(date, ApplicationConstants.DATE_FORMAT, Locale.getDefault());
        List<Exam> examsToProcess = examRepository.findAllByProcessedAndProcessingDate("false", processingDate);
        if(examsToProcess != null && !examsToProcess.isEmpty()) {
            examsToProcess.forEach(exam -> {
                if(exam != null) {
                    String homeDirectory = ApplicationConstants.HOME_DIRECTORY;
                    String scannedSheetDirectory = homeDirectory + "/" + exam.getInputExamSheetsDirectory().replace(" ", "");
                    System.out.println("exam inside processExamSheets() " + exam);
                    System.out.println("input exam directory " + scannedSheetDirectory);
                    if (!StringUtils.isEmpty(scannedSheetDirectory)) {
                        List<String> uploadedSheets = storageService.loadUploadedExams(scannedSheetDirectory);
                        ExamGradeDetails examGradeDetails = new ExamGradeDetails();
                        List<StudentGradeDetails> studentGradeDetails = new ArrayList<>();

                        uploadedSheets.forEach(examSheet -> {
                            if (examSheet != null) {
                                String imageUrl = scannedSheetDirectory + "/" + examSheet;
                                System.out.println("ImageUrl = " + imageUrl);
                                StudentGradeDetails studentGradeDetail = gradeExamSheet(imageUrl, exam, examSheet);
                                studentGradeDetails.add(studentGradeDetail);

                                exam.setProcessed(ApplicationConstants.TRUE);
                            }
                        });
                        examRepository.save(exam);

                        examGradeDetails.setStudentGradeDetails(studentGradeDetails);
                        examGradeDetails.setExam(exam);

                        examGradeRepository.save(examGradeDetails);
                    } else {
                        System.out.println("exam inside processExamSheets()  not saved" + exam);
                    }
                }
            });
        }



    }

    /**
     * Calculates the points obtained by the user on each question.Also calculates the total.
     * The grade details are saved in object StudentGradeDetails
     * @param imageUrl
     * @param exam
     * @param examSheet
     * @return
     */
    private StudentGradeDetails gradeExamSheet(String imageUrl, Exam exam, String examSheet) {

        List<Question> questions = exam.getQuestions();
        StudentGradeDetails studentGradeDetail = new StudentGradeDetails();

        List<PointDetails> pointDetails = new ArrayList<>();
        if (!questions.isEmpty()) {
            questions.forEach(question -> {
                if (question != null) {
                    PointDetails pointDetail = new PointDetails();
                    pointDetail.setQuestionNumber(question.getQuestionNumber());
                    pointDetail.setAchievablePoints(question.getPoints());

                    String croppedAnswer = getTextFromImage(imageUrl,question.getAnswerCoordinates());
                    pointDetail.setAnswerGivenByStudent(croppedAnswer);

                    double points = 0;
                    double achievablePoints = Double.parseDouble(question.getPoints());

                    String gradingMode = exam.getGradingMode();
                    if (croppedAnswer.equalsIgnoreCase(question.getPossibleAnswers())) {
                        points = achievablePoints;
                    } else {
                        points = getPoints(question, croppedAnswer, points, achievablePoints, gradingMode);
                    }
                    pointDetail.setAchievedPoints(Double.toString(points));

                    double totalPoints = getTotalPoints(points);
                    pointDetail.setTotalPoints(Double.toString(totalPoints));

                    pointDetail.setQuestionImageName(examSheet);
                    pointDetail.setAnswerCoordinates(question.getAnswerCoordinates());
                    pointDetail.setPossibleAnswers(question.getPossibleAnswers());
                    pointDetail.setExamFolder(exam.getInputExamSheetsDirectory());
                    pointDetails.add(pointDetail);

                    System.out.println(pointDetails);
                }

            });
        }


        String matriculationNumber = getTextFromImage(imageUrl, exam.getMatriculationNo());
        studentGradeDetail.setMatriculationNumber(matriculationNumber);
        studentGradeDetail.setPointDetails(pointDetails);
        studentGradeDetail.setCourse(exam.getCourse());
        studentGradeDetail.setExamFolder(exam.getInputExamSheetsDirectory());

        return studentGradeDetail;

    }

    /**
     * Sends rest request to get the text from given image on specified coordinates.
     * @param imageUrl
     * @param coordinates
     * @return extracted text.
     */
    private String getTextFromImage(String imageUrl, String coordinates) {
        Map request = new ConcurrentHashMap();
        request.put(ApplicationConstants.IMAGE_URL_PARAMETER, imageUrl);
        request.put(ApplicationConstants.TEXT_COORDINATES_PARAMETER, coordinates);
        return restTemplate.postForObject(ApplicationConstants.GET_TEXT_FROM_IMAGE_URL, request, String.class);
    }

    /**
     * Keeps the count of total
     * @param points
     * @return
     */
    double getTotalPoints(double points) {
        return totalPoints += points;
    }

    /**
     * Calculates the points based on grading criteria used.
     * @param question
     * @param croppedAnswer
     * @param points
     * @param achievablePoints
     * @param gradingMode
     * @return
     */
    private double getPoints(Question question, String croppedAnswer, double points, double achievablePoints, String gradingMode) {

        String[] croppedAnswers = croppedAnswer.split(", ");
        String[] possibleAnswers = question.getPossibleAnswers().split(",");
        for (String answer : possibleAnswers) {
            int correctAnswers = 0;
            for (String givenAnswer : croppedAnswers) {
                if (givenAnswer.equalsIgnoreCase(answer)) {
                    correctAnswers += 1;
                    if (ApplicationConstants.GRADING_MODE_FULL.equalsIgnoreCase(gradingMode)) {
                        if (correctAnswers >= possibleAnswers.length)
                            points = achievablePoints;
                        else
                            points = 0;
                    } else {
                        if (correctAnswers < possibleAnswers.length) {
                            double pointsPerQuestion = achievablePoints / possibleAnswers.length;
                            points = pointsPerQuestion * correctAnswers;
                        } else {
                            points = achievablePoints;
                        }
                    }
                }
            }
        }
        return points;
    }

    /**
     * Deletes the given exam.
     * @param exam
     * @return
     */
    @DeleteMapping("deleteExam")
    public ResponseEntity<Exam> deleteExam(@RequestBody Exam exam) {
        Exam examToDelete = examRepository.findById(exam.getId()).get();
        System.out.println(examToDelete);
        if (examToDelete != null) {
            examRepository.delete(exam);
        }

        return new ResponseEntity<>(exam, HttpStatus.OK);
    }

}
