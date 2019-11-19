package service.util;

/**
 * Contains the constants used across the application
 */
public interface ApplicationConstants {

    String DATE_FORMAT = "yyyy-MM-dd";
    String USER_HOME = "user.dir";
    String HOME_DIRECTORY = "/usr/src/app";
    String PROCESS_EXAM_SHEET_SERIAL_URL = "http://exam-autograder-processor:5000/processExamSheetSerial";
    String GET_TEXT_FROM_IMAGE_URL = "http://exam-autograder-processor:5000/getTextFromImage";
    String HELLO_SERVICE = "http://exam-autograder-processor:5000/hello";
    String SERIAL_PROCESSING = "Serial";
    String GRADING_MODE_FULL = "full";
    String GRADING_MODE_PARTIAL = "partial";
    String TRUE = "true";
    String PNG = "png";
    String JPEG = "jpeg";
    String JPG = "jpg";
    String PDF = "pdf";
    String IMAGE_URL_PARAMETER = "image_url";
    String TEXT_COORDINATES_PARAMETER = "text_coordinates";

    String NAME_PATTERN = "Name[:?=>->]+";
    String MATRICULATION_NO_PATTERN = "Matriculation Number[:?=>->]+";
    String TOPIC_PATTERN = "Topic \\d+[:]";
    String POINTS_PATTERN = "\\d+[P]";
    String SUB_TOPIC_PATTERN = "[a-zA-Z]+\\)";

}
