package de.tu.darmstadt.repositories;

import de.tu.darmstadt.entitiy.Exam;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Repository is used for saving Exam in mongo database
 * This repository also provides crud operations
 */
public interface ExamRepository extends MongoRepository<Exam,String> {
    List<Exam> findAllByProcessed(String processed);
    List<Exam> findAllByProcessedAndProcessingDate(String processed, String processingDate);
}
