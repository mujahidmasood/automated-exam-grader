package de.tu.darmstadt.controller;

import de.tu.darmstadt.entitiy.FileUploadEntity;
import de.tu.darmstadt.services.StorageService;
import de.tu.darmstadt.util.ApplicationConstants;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Provides file upload related endpoints used by ExamGrader Ui
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/examfile")
public class FileUploadController {

    @Autowired
    StorageService storageService;

    @PostMapping("/uploadExamSheets")
    public ResponseEntity<String> uploadExamSheets(
            @RequestParam("file") MultipartFile[] examSheets,
            @RequestParam("examFolder") String examFolder,
            @RequestParam("reorderExams") String reorderExams,
            @RequestParam("examId") String examId) {

        try {

            System.out.println("uploadExamSheets() home = " + ApplicationConstants.HOME_DIRECTORY);
            System.out.println("uploadExamSheets() examFolder = " + examFolder );
            String scannedSheetsDirectory = ApplicationConstants.HOME_DIRECTORY + "/" + examFolder.replace(" ", "");
            System.out.println("uploadExamSheets() scannedSheetsDirectory = " + scannedSheetsDirectory );
            for (MultipartFile examSheet : examSheets) {
                if (reorderExams.equalsIgnoreCase("true")) {
                    storageService.store(examSheet, scannedSheetsDirectory, examId);
                }
            }
            return ResponseEntity.status(HttpStatus.OK).body("You successfully uploaded in directory !");

        } catch (Exception ioe) {
            System.out.println(ioe.getMessage());
            ioe.printStackTrace();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("FAIL to upload !");
        }
    }


    @GetMapping("/getallfiles")
    public ResponseEntity<List<String>> getListFiles(@RequestParam("examFolder") String examFolder) {
        System.out.println("examFolder getListFiles() = " + examFolder);
        String homeDirectory = ApplicationConstants.HOME_DIRECTORY;
        String scannedSheetDirectory = homeDirectory + "/" + examFolder.replace(" ", "");

        List<String> uploadedExams = storageService.loadUploadedExams(scannedSheetDirectory);
        System.out.println("uploadedExams size() = " + uploadedExams.size());
        return ResponseEntity.ok().body(uploadedExams);
    }

    /**
     * Gets the scanned image sheet of student from the specified directory and name of file.
     * and shows in the pdf viewer.
     * @param examFolder
     * @param fileName
     * @return
     */
    @GetMapping("/filedetails")
    public ResponseEntity<InputStreamResource> getFileDeails(@RequestParam("examFolder") String examFolder, @RequestParam("fileName") String fileName) {


        String homeDirectory = ApplicationConstants.HOME_DIRECTORY;
        String scannedSheetDirectory = homeDirectory + "/" + examFolder.replace(" ", "");

        try {
            Resource resource = storageService.loadFile(scannedSheetDirectory, fileName);

            HttpHeaders respHeaders = new HttpHeaders();
            respHeaders.setContentType(MediaType.parseMediaType("application/pdf"));
            respHeaders.setContentLength(resource.contentLength());
            respHeaders.setContentDispositionFormData("attachment;filename=", resource.getFilename());

            InputStreamResource isr = new InputStreamResource(new FileInputStream(resource.getFile()));
            return new ResponseEntity<>(isr, respHeaders, HttpStatus.OK);


        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("/getImage")
    public ResponseEntity<Map<String, String>> getImage(
            @RequestParam("examFolder") String examFolder,
            @RequestParam("fileName") String fileName,
            @RequestParam("answerCoordinates") String answerCoordinates
    ) throws IOException {

        String homeDirectory = ApplicationConstants.HOME_DIRECTORY;
        String scannedSheetDirectory = homeDirectory + "/" + examFolder.replace(" ", "");

        String pathName = scannedSheetDirectory + "/" + fileName;
        System.out.println("pathName =" + pathName);
        Path path = Paths.get(pathName);

        System.out.println("Path = " + path);
        System.out.println("answerCoordinates = " + answerCoordinates);
        HashMap<String, String> response = null;
        if (path.toFile().exists()) {
            System.out.println("file exists");
            BufferedImage originalImgage = ImageIO.read(path.toFile());

            if (answerCoordinates.isEmpty()) {
                System.out.println("no coordinates" + answerCoordinates);
                response = getBase64Response(originalImgage);
            } else {
                String[] imageAnswerCoordinates = answerCoordinates.split(",");
                int x = Integer.parseInt(imageAnswerCoordinates[0].trim());
                int y = Integer.parseInt(imageAnswerCoordinates[1].trim());
                int w = Integer.parseInt(imageAnswerCoordinates[2].trim());
                int h = Integer.parseInt(imageAnswerCoordinates[3].trim());

                Rectangle rectangle = new Rectangle(x, y, w, h);
                BufferedImage croppedImage = originalImgage.getSubimage(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
                response = getBase64Response(croppedImage);

            }
        } else {
            System.out.println("file does not exist");
        }

        return ResponseEntity.ok().body(response);
    }

    private HashMap<String, String> getBase64Response(BufferedImage croppedImage) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        ImageIO.write(croppedImage, "jpeg", baos);
        byte[] bytes = baos.toByteArray();
        String b64 = Base64.encodeBase64String(bytes);
        baos.close();
        HashMap<String, String> response = new HashMap<>();
        response.put("imageUrl", b64);
        return response;
    }


    @DeleteMapping("deleteStudentExamSheet")
    public ResponseEntity<String> deleteExam(@RequestBody FileUploadEntity uploadEntity) {
        String isDeleted = storageService.delete(uploadEntity.getExamFolder(), uploadEntity.getFileName());
        return ResponseEntity.ok().body(isDeleted);
    }


}
