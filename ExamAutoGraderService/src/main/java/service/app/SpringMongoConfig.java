package service.app;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

/**
 * Contains the MongoDB configuration used by spring boot.
 *
 * Migrated from the removed {@code AbstractMongoConfiguration} /
 * {@code com.mongodb.MongoClient} APIs to the
 * {@code AbstractMongoClientConfiguration} / {@code com.mongodb.client.MongoClient}
 * APIs introduced with Spring Data MongoDB 3.x (Spring Boot 2.7).
 */
@Configuration
public class SpringMongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.host}")
    private String mongoHost;

    @Value("${spring.data.mongodb.port}")
    private String mongoPort;

    @Value("${spring.data.mongodb.database}")
    private String mongoDB;

    @Override
    protected String getDatabaseName() {
        return mongoDB;
    }

    @Override
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://" + mongoHost + ":" + mongoPort);
    }
}
