package service.entitiy;

/**
 * Pojo for questions
 */
public class Question {

    private String questionNumber;
    private String possibleAnswers;
    private String points;
    private String answerCoordinates;
    private String questionDescription;
    private String questionType;
    private String isMandatory;

    public String getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(String questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getPossibleAnswers() {
        return possibleAnswers;
    }

    public void setPossibleAnswers(String possibleAnswers) {
        this.possibleAnswers = possibleAnswers;
    }

    public String getPoints() {
        return points;
    }

    public void setPoints(String points) {
        this.points = points;
    }

    public String getAnswerCoordinates() {
        return answerCoordinates;
    }

    public void setAnswerCoordinates(String answerCoordinates) {
        this.answerCoordinates = answerCoordinates;
    }

    public String getQuestionDescription() {
        return questionDescription;
    }

    public void setQuestionDescription(String questionDescription) {
        this.questionDescription = questionDescription;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getIsMandatory() {
        return isMandatory;
    }

    public void setIsMandatory(String isMandatory) {
        this.isMandatory = isMandatory;
    }

    @Override
    public String toString() {
        return "Question{" +
                "questionNumber='" + questionNumber + '\'' +
                ", possibleAnswers='" + possibleAnswers + '\'' +
                ", points='" + points + '\'' +
                ", answerCoordinates='" + answerCoordinates + '\'' +
                ", questionDescription='" + questionDescription + '\'' +
                ", questionType='" + questionType + '\'' +
                ", isMandatory='" + isMandatory + '\'' +
                '}';
    }
}
