package service.entitiy;

/**
 * Pojo for Subtopics
 */
public class SubTopic {

    private String subTopicName;
    private String subTopicNumber;
    private String subTopicPoints;
    private String subTopicDescription;

    public String getSubTopicName() {
        return subTopicName;
    }

    public void setSubTopicName(String subTopicName) {
        this.subTopicName = subTopicName;
    }

    public String getSubTopicNumber() {
        return subTopicNumber;
    }

    public void setSubTopicNumber(String subTopicNumber) {
        this.subTopicNumber = subTopicNumber;
    }

    public String getSubTopicPoints() {
        return subTopicPoints;
    }

    public void setSubTopicPoints(String subTopicPoints) {
        this.subTopicPoints = subTopicPoints;
    }

    public String getSubTopicDescription() {
        return subTopicDescription;
    }

    public void setSubTopicDescription(String subTopicDescription) {
        this.subTopicDescription = subTopicDescription;
    }

    @Override
    public String toString() {
        return "SubTopic{" +
                "subTopicName='" + subTopicName + '\'' +
                ", subTopicNumber='" + subTopicNumber + '\'' +
                ", subTopicPoints='" + subTopicPoints + '\'' +
                ", subTopicDescription='" + subTopicDescription + '\'' +
                '}';
    }
}
