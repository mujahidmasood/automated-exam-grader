package de.tu.darmstadt.services;

import de.tu.darmstadt.entitiy.Exam;
import de.tu.darmstadt.repositories.ExamRepository;
import de.tu.darmstadt.util.ApplicationConstants;
import org.apache.commons.io.FilenameUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.validation.constraints.NotNull;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service helps in saving the uploaded files.
 */
@Service
public class StorageService {

    @Autowired
    ExamRepository repository;

    @Autowired
    RestTemplate restTemplate;

    PDDocument document;

    /**
     * Stores the uploaded files in specified directory.
     *  Helps in identifying pages without matriculation number.
     *  Creates the single sheet containing all the pages from one student( when single scanned image will be uploaded)
     *
     * @param uploadedFile
     * @param scannedSheetsDirectory
     * @param examId
     */
    public void store(@NotNull MultipartFile uploadedFile, @NotNull String scannedSheetsDirectory, String examId) {

        try {

            Path path = Paths.get(scannedSheetsDirectory);
            if (!Files.exists(path)) {
                Files.createDirectory(path);
            }

            System.out.println("store() scannedSheetsDirectory = " + scannedSheetsDirectory);

            File examSheet = convertMultiPartFileToFile(uploadedFile, scannedSheetsDirectory);
            System.out.println("store() examSheet = " + examSheet);

            String fileExtension = FilenameUtils.getExtension(examSheet.getName());
            System.out.println("store() fileExtension = " + fileExtension);

            Map<String, BufferedImage> images = null;

            if (ApplicationConstants.PDF.equalsIgnoreCase(fileExtension)) {
                System.out.println("condition pdf = " + ApplicationConstants.PDF.equalsIgnoreCase(fileExtension));
                images = processPdf(scannedSheetsDirectory, examSheet);

            } else {
                images = new HashMap<>();
                BufferedImage image = ImageIO.read(examSheet);
                images.put(examSheet.getName(), image);
                ImageIO.read(examSheet);
            }

            for (Map.Entry<String, BufferedImage> entries : images.entrySet()) {
                String fileName = scannedSheetsDirectory + "/" + entries.getKey();
                System.out.println("store() filename = " + fileName);
                BufferedImage image = entries.getValue();

                Map<String, String> request = new HashMap<>();


                request.put("image_url", fileName);

                Optional<Exam> optionalExam = repository.findById(examId);
                Exam exam = optionalExam.get();

                String matriculationNoCoordinates = exam.getMatriculationNo();

                request.put("text_coordinates", matriculationNoCoordinates);

                System.out.println("request = " + request);

                String matriculationId = restTemplate.postForObject(ApplicationConstants.GET_TEXT_FROM_IMAGE_URL, request, String.class);

                if (matriculationId == null) {
                    matriculationId = "MatriculationNotFound";
                }

                System.out.println("matriculationId = " + matriculationId);

                path = Paths.get(scannedSheetsDirectory + "/" + matriculationId + ".pdf");
                System.out.println("path for student pdf = " + path);

                File examPdfFile = new File(path.toUri());
                System.out.println("examPdfFile = " + examPdfFile);
                if (!examPdfFile.exists()) {
                    examPdfFile.createNewFile();
                }

                createPDFFromImage(examPdfFile, image);

            }

        } catch (Exception e) {
            System.err.println(e);
            e.printStackTrace();
        }
    }

    /**
     * Creates pdf files from the given images.
     * @param file
     * @param image
     */
    private void createPDFFromImage(File file, BufferedImage image) {

        try {

            if (document == null) {
                document = new PDDocument();
            }

            PDPage page = new PDPage(new PDRectangle(image.getWidth(), image.getHeight()));

            document.addPage(page);
            PDImageXObject pdImage = LosslessFactory.createFromImage(document, image);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
                contentStream.drawImage(pdImage, 0, 0);
            }
            document.save(file);

        } catch (Exception ex) {
            System.out.println("loading failed " + ex.getMessage());
            ex.printStackTrace();
        }
    }

    /**
     * if the file is uploaded as multipart this method makes it a single file.
     * @param uploadedFile
     * @param studentExamFolder
     * @return
     * @throws IOException
     */
    private File convertMultiPartFileToFile(MultipartFile uploadedFile, String studentExamFolder) throws IOException {

        File examSheet = new File(studentExamFolder + "/" + uploadedFile.getOriginalFilename());
        if (examSheet.exists()) {
            Files.delete(examSheet.toPath());
        }
        examSheet.createNewFile();
        FileOutputStream fos = new FileOutputStream(examSheet);
        fos.write(uploadedFile.getBytes());
        fos.close();

        return examSheet;
    }

    /**
     * Load the saved file from specified folder
     * @param examFolder
     * @param fileName
     * @return
     */
    public Resource loadFile(String examFolder, String fileName) {
        System.out.println("examFolder = " + examFolder + " filename = "+ fileName);
        Path filePath = Paths.get(examFolder + "/" + fileName);
        System.out.println("filePath to uri = " + filePath.toUri());
        System.out.println(filePath.toFile().exists());
        return loadResource(filePath);
    }

    /**
     * Load the file from given path.
     * This makes sure file is not corrupt.
     * @param filePath
     * @return
     */
    private Resource loadResource(Path filePath) {
        try {
            Resource resource = new UrlResource(filePath.toUri());
            System.out.println("resource " + resource);
            System.out.println("exists " + resource.exists());
            System.out.println("isReadable " + resource.isReadable());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
        } catch (Exception ex) {
            System.err.println("Error reading file" + ex);
            throw new RuntimeException(ex);
        }
        throw new RuntimeException();
    }

    /**
     * Load the list of all the uploaded exam sheets(images) in given folder.
     * @param folderName
     * @return
     */
    public List<String> loadUploadedExams(@NotNull String folderName) {

        System.out.println("folderName = " + folderName);
        String scannedSheetDirectory = folderName.replace(" ", "");
        System.out.println("scannedSheetDirectory inside loadUploadedExams() " + scannedSheetDirectory);
        File uploadedLocation = new File(scannedSheetDirectory);
        System.out.println("uploadedLocation loadUploadedExams() = " + uploadedLocation.getAbsolutePath());
        File[] files = uploadedLocation.listFiles();
        List fileList = new ArrayList();
        if (files != null && files.length > 0) {
            fileList = Arrays.asList(files).parallelStream()
                    .filter(file -> !file.getName().startsWith("."))
                    .filter(file -> filterImagesOnly(file.getName()))
                    .map(file -> file.getName())
                    .collect(Collectors.toList());
        } else {
            System.out.println("files == null");
        }

        return fileList;
    }

    /**
     * Check to allow only images.
     * @param fileName
     * @return
     */
    private boolean filterImagesOnly(String fileName) {
        return fileName.endsWith(ApplicationConstants.PNG) ||
                fileName.endsWith(ApplicationConstants.JPEG) ||
                fileName.endsWith(ApplicationConstants.JPG) ||
                fileName.endsWith(ApplicationConstants.JPEG);
    }

    /**
     * Deletes the file from specified folder
     * @param folderName
     * @param fileName
     * @return
     */
    public String delete(String folderName, String fileName) {
        Path uploadLocation = Paths.get(folderName + "/" + fileName);
        try {
            Files.delete(uploadLocation);
            return Boolean.toString(!uploadLocation.toFile().exists());
        } catch (IOException ioe) {
            System.out.println("Exception while deleting " + ioe);
            return "Exception while deleting";
        }
    }

    /**
     * if uploaded file is pdf, the images from pdf are extracted
     * @param uploadLocation
     * @param examSheet
     * @return
     */
    private Map<String, BufferedImage> processPdf(String uploadLocation, File examSheet) {

        Map<String, BufferedImage> images = new HashMap<>();
        try (PDDocument document = PDDocument.load(examSheet)) {

            PDFRenderer renderer = new PDFRenderer(document);
            for (int pageNum = 0; pageNum < document.getNumberOfPages(); pageNum++) {

                System.out.println("Processing page: " + pageNum);

                BufferedImage image = renderer.renderImage(pageNum);

                File file = new File(uploadLocation + "/" + FilenameUtils.removeExtension(examSheet.getName()) + pageNum + "." + ApplicationConstants.JPEG);

                Files.deleteIfExists(Paths.get(file.getName()));
                if (!file.exists()) {
                    System.out.println("file exists = " + file.getName());
                    file = Files.createFile(Paths.get(file.getName())).toFile();
                }

                ImageIO.write(image, ApplicationConstants.JPEG, file);
                images.put(file.getName(), image);

                System.out.println("Image created" + file);
            }
        } catch (IOException ioe) {
            System.err.println(ioe);
        }

        return images;

    }

}
