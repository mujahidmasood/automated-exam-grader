package de.tu.darmstadt.app;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

/**
 * Contains configs used by spring boot
 */
@Configuration
public class SpringMongoConfig extends AbstractMongoConfiguration {
    @Value("${spring.profiles.active}")
    private String profileActive;

    @Value("${spring.application.name}")
    private String proAppName;

    @Value("${spring.data.mongodb.host}")
    private String mongoHost;

    @Value("${spring.data.mongodb.port}")
    private String mongoPort;

    @Value("${spring.data.mongodb.database}")
    private String mongoDB;

    @Value("${spring.data.mongodb.username}")
    private String  userName;

    @Value("${spring.data.mongodb.password}")
    private String  password;

    @Value("${server.port}")
    private String serverPort;

    @Override
    public MongoMappingContext mongoMappingContext()
            throws ClassNotFoundException {
        return super.mongoMappingContext();
    }

    @Bean
    public Mongo mongo() throws Exception {
        return new MongoClient(mongoHost + ":" + mongoPort);
    }
    @Override
    protected String getDatabaseName() {
        return mongoDB;
    }

    @Override
    public MongoClient mongoClient() {
        return null;
    }
}