package service.entitiy;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Data structure for saving exam in mongo db.
 * These fields serve the purpose of columns in table exam of mongo db.
 */
@Document(collection = "exam")
public class Exam {

    @Id
    private String id;

    private String language;
    private String course;
    private String semester;
    private String year;
    private String matriculationNo;
    private String fullName;
    private String processed;
    private String processingDate;
    private String processingTime;
    private String processingMode;
    private String inputExamSheetsDirectory;
    private String instructor;

    public String getGradingMode() {
        return gradingMode;
    }

    public void setGradingMode(String gradingMode) {
        this.gradingMode = gradingMode;
    }

    private String gradingMode;

    private List<Topic> topics;
    private List<SubTopic> subTopics;
    private List<Question> questions;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMatriculationNo() {
        return matriculationNo;
    }

    public void setMatriculationNo(String matriculationNo) {
        this.matriculationNo = matriculationNo;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getProcessed() {
        return processed;
    }

    public void setProcessed(String processed) {
        this.processed = processed;
    }

    public String getProcessingDate() {
        return processingDate;
    }

    public void setProcessingDate(String processingDate) {
        this.processingDate = processingDate;
    }

    public String getProcessingTime() {
        return processingTime;
    }

    public void setProcessingTime(String processingTime) {
        this.processingTime = processingTime;
    }

    public String getProcessingMode() {
        return processingMode;
    }

    public void setProcessingMode(String processingMode) {
        this.processingMode = processingMode;
    }

    public String getInputExamSheetsDirectory() {
        return inputExamSheetsDirectory;
    }

    public void setInputExamSheetsDirectory(String inputExamSheetsDirectory) {
        this.inputExamSheetsDirectory = inputExamSheetsDirectory;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    public List<SubTopic> getSubTopics() {
        return subTopics;
    }

    public void setSubTopics(List<SubTopic> subTopics) {
        this.subTopics = subTopics;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    @Override
    public String toString() {
        return "Exam{" +
                "id='" + id + '\'' +
                ", language='" + language + '\'' +
                ", course='" + course + '\'' +
                ", semester='" + semester + '\'' +
                ", year='" + year + '\'' +
                ", matriculationNo='" + matriculationNo + '\'' +
                ", fullName='" + fullName + '\'' +
                ", processed='" + processed + '\'' +
                ", processingDate='" + processingDate + '\'' +
                ", processingTime='" + processingTime + '\'' +
                ", processingMode='" + processingMode + '\'' +
                ", inputExamSheetsDirectory='" + inputExamSheetsDirectory + '\'' +
                ", instructor='" + instructor + '\'' +
                ", gradingMode='" + gradingMode + '\'' +
                ", topics=" + topics +
                ", subTopics=" + subTopics +
                ", questions=" + questions +
                '}';
    }
}
