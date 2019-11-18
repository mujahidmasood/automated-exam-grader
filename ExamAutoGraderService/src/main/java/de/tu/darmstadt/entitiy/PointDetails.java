package de.tu.darmstadt.entitiy;

/**
 * Data structure for saving points related information in database.
 *
 */
public class PointDetails {

    String questionNumber;
    String achievedPoints;
    String achievablePoints;
    String answerGivenByStudent;
    String totalPoints;
    String questionImageName;
    String possibleAnswers;
    String answerCoordinates;
    String examFolder;

    public String getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(String questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getAchievedPoints() {
        return achievedPoints;
    }

    public void setAchievedPoints(String achievedPoints) {
        this.achievedPoints = achievedPoints;
    }

    public String getAchievablePoints() {
        return achievablePoints;
    }

    public void setAchievablePoints(String achievablePoints) {
        this.achievablePoints = achievablePoints;
    }

    public String getAnswerGivenByStudent() {
        return answerGivenByStudent;
    }

    public void setAnswerGivenByStudent(String answerGivenByStudent) {
        this.answerGivenByStudent = answerGivenByStudent;
    }

    public String getQuestionImageName() {
        return questionImageName;
    }

    public void setQuestionImageName(String questionImageName) {
        this.questionImageName = questionImageName;
    }

    public String getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(String totalPoints) {
        this.totalPoints = totalPoints;
    }

    public String getPossibleAnswers() {
        return possibleAnswers;
    }

    public void setPossibleAnswers(String possibleAnswers) {
        this.possibleAnswers = possibleAnswers;
    }

    public String getExamFolder() {
        return examFolder;
    }

    public void setExamFolder(String examFolder) {
        this.examFolder = examFolder;
    }

    public String getAnswerCoordinates() {
        return answerCoordinates;
    }

    public void setAnswerCoordinates(String answerCoordinates) {
        this.answerCoordinates = answerCoordinates;
    }

    @Override
    public String toString() {
        return "PointDetails{" +
                "questionNumber='" + questionNumber + '\'' +
                ", achievedPoints='" + achievedPoints + '\'' +
                ", achievablePoints='" + achievablePoints + '\'' +
                ", answerGivenByStudent='" + answerGivenByStudent + '\'' +
                ", totalPoints='" + totalPoints + '\'' +
                ", questionImageName='" + questionImageName + '\'' +
                ", possibleAnswers='" + possibleAnswers + '\'' +
                ", answerCoordinates='" + answerCoordinates + '\'' +
                ", examFolder='" + examFolder + '\'' +
                '}';
    }
}
