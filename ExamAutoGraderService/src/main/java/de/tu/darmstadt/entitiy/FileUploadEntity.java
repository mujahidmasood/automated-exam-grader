package de.tu.darmstadt.entitiy;

/**
 * Helper class for file upload
 */
public class FileUploadEntity {

    String examFolder;
    String fileName;

    public String getExamFolder() {
        return examFolder;
    }

    public void setExamFolder(String examFolder) {
        this.examFolder = examFolder;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public String toString() {
        return "FileUploadEntity{" +
                "examFolder='" + examFolder + '\'' +
                ", fileName='" + fileName + '\'' +
                '}';
    }
}
