package de.tu.darmstadt.entitiy;

import java.util.List;

/**
 * Pojo for StudentGradeDetails
 */
public class StudentGradeDetails {

    String course;
    String examFolder;
    String matriculationNumber;
    boolean isPassed = false;
    String grade;
    String gradeComments;
    List<PointDetails> pointDetails;
    String attemptNumber;
    String studentExamSheetUrl;


    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getExamFolder() {
        return examFolder;
    }

    public void setExamFolder(String examFolder) {
        this.examFolder = examFolder;
    }

    public String getMatriculationNumber() {
        return matriculationNumber;
    }

    public void setMatriculationNumber(String matriculationNumber) {
        this.matriculationNumber = matriculationNumber;
    }

    public boolean isPassed() {
        return isPassed;
    }

    public void setPassed(boolean passed) {
        isPassed = passed;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getGradeComments() {
        return gradeComments;
    }

    public void setGradeComments(String gradeComments) {
        this.gradeComments = gradeComments;
    }

    public List<PointDetails> getPointDetails() {
        return pointDetails;
    }

    public void setPointDetails(List<PointDetails> pointDetails) {
        this.pointDetails = pointDetails;
    }

    public String getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(String attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public String getStudentExamSheetUrl() {
        return studentExamSheetUrl;
    }

    public void setStudentExamSheetUrl(String studentExamSheetUrl) {
        this.studentExamSheetUrl = studentExamSheetUrl;
    }

    @Override
    public String toString() {
        return "StudentGradeDetails{" +
                "course='" + course + '\'' +
                ", examFolder='" + examFolder + '\'' +
                ", matriculationNumber='" + matriculationNumber + '\'' +
                ", isPassed=" + isPassed +
                ", grade='" + grade + '\'' +
                ", gradeComments='" + gradeComments + '\'' +
                ", pointDetails=" + pointDetails +
                ", attemptNumber='" + attemptNumber + '\'' +
                ", studentExamSheetUrl='" + studentExamSheetUrl + '\'' +
                '}';
    }
}
