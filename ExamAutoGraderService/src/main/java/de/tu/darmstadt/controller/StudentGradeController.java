package de.tu.darmstadt.controller;

import de.tu.darmstadt.entitiy.Exam;
import de.tu.darmstadt.entitiy.ExamGradeDetails;
import de.tu.darmstadt.entitiy.StudentGradeDetails;
import de.tu.darmstadt.repositories.ExamGradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Provides ExamGrades related endpoints used by ExamGraderUi
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/grades")
public class StudentGradeController {

    @Autowired
    ExamGradeRepository examGradeRepository;

    /**
     * fetches the details of graded exams.
     * @return list of all graded exams with details
     */
    @GetMapping("getGradedExams")
    public ResponseEntity<List<ExamGradeDetails>> getGradedExams() {
        List<ExamGradeDetails> examGradeDetails = examGradeRepository.findAll();
        if (!examGradeDetails.isEmpty()) {
            return new ResponseEntity<>(examGradeDetails, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    /**
     * Deletes the grades of specified exam
     * @param exam
     * @return whether delete operation was success or failure.
     */
    @DeleteMapping("deleteGradedExam")
    public ResponseEntity<String> deleteGradedExam(@RequestBody ExamGradeDetails exam) {
        ExamGradeDetails gradeToDelete = examGradeRepository.findById(exam.getId()).get();
        System.out.println(gradeToDelete);
        if (gradeToDelete != null) {
            examGradeRepository.delete(exam);
            return new ResponseEntity<>("Success!", HttpStatus.OK);
        }

        return new ResponseEntity<>("Failed!", HttpStatus.EXPECTATION_FAILED);
    }

    /**
     * Deletes the grades of specified exam
     * @param examGradeDetails
     * @return whether delete operation was success or failure.
     */
    @PostMapping("updateGradedExam")
    public ResponseEntity<String> updateGradedExam(@RequestBody ExamGradeDetails examGradeDetails) {
        System.out.println("updateGradedExam() examGradeDetails to be saved = " + examGradeDetails);
        ExamGradeDetails savedExamGradeDetails = examGradeRepository.save(examGradeDetails);
        System.out.println("updateGradedExam() examGradeDetails saved = " + savedExamGradeDetails);
        if (savedExamGradeDetails != null) {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        }
        return new ResponseEntity<>("Failure",HttpStatus.EXPECTATION_FAILED);

    }

}
