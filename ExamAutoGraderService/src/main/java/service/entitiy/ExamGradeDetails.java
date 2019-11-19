package service.entitiy;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Data structure for saving ExamGradeDetails in mongo db.
 * These fields serve the purpose of columns in table ExamGradeDetails of mongo db.
 */
@Document(collection = "examgrades")
public class ExamGradeDetails {

    @Id
    String id;

    Exam exam;
    List<StudentGradeDetails> studentGradeDetails;

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public List<StudentGradeDetails> getStudentGradeDetails() {
        return studentGradeDetails;
    }

    public void setStudentGradeDetails(List<StudentGradeDetails> studentGradeDetails) {
        this.studentGradeDetails = studentGradeDetails;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "ExamGradeDetails{" +
                "id='" + id + '\'' +
                ", exam=" + exam +
                ", studentGradeDetails=" + studentGradeDetails +
                '}';
    }
}
