package service.app;


import service.controller.ExamController;
import service.controller.FileUploadController;
import service.controller.StudentGradeController;
import service.repositories.ExamGradeRepository;
import service.repositories.ExamRepository;
import service.services.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

/**
 * Main class for booting up spring boot related services
 */
@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackageClasses = {
        ExamController.class,
        FileUploadController.class,
        StorageService.class,
        StudentGradeController.class
})
@EnableMongoRepositories(basePackageClasses = {
        ExamRepository.class,
        ExamGradeRepository.class
})
public class Application {

    @Autowired
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
