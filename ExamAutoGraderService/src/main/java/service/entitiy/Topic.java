package service.entitiy;


/**
 * Pojo for topics
 */
public class Topic {

    private String topicName;
    private String topicNumber;
    private String topicPoints;
    private String topicDescription;

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicNumber() {
        return topicNumber;
    }

    public void setTopicNumber(String topicNumber) {
        this.topicNumber = topicNumber;
    }

    public String getTopicPoints() {
        return topicPoints;
    }

    public void setTopicPoints(String topicPoints) {
        this.topicPoints = topicPoints;
    }

    public String getTopicDescription() {
        return topicDescription;
    }

    public void setTopicDescription(String topicDescription) {
        this.topicDescription = topicDescription;
    }

    @Override
    public String toString() {
        return "Topic{" +
                "topicName='" + topicName + '\'' +
                ", topicNumber='" + topicNumber + '\'' +
                ", topicPoints='" + topicPoints + '\'' +
                ", topicDescription='" + topicDescription + '\'' +
                '}';
    }
}
