package de.tu.darmstadt.repositories;

import de.tu.darmstadt.entitiy.ExamGradeDetails;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Repository is used for saving ExamGradeDetails in mongo database
 * This repository also provides crud operations
 */
public interface ExamGradeRepository extends MongoRepository<ExamGradeDetails,String> {

}
