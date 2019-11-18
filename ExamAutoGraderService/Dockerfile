
#Before running this docker file please make sure to run mvn clean install

FROM openjdk:8

#FROM maven:3.6.0-jdk-11-slim AS build
#COPY src /home/app/src
#COPY pom.xml /home/app
#RUN mvn -f /home/app/pom.xml clean install



RUN mkdir code
ENV PROJECT_HOME code
WORKDIR code
COPY /target/exam-autograder-service.jar exam-autograder-service.jar



EXPOSE 9090
CMD ["java", "-Dspring.data.mongodb.uri=mongodb://exam-autograder-db:27017/exam-autograder-db","-Djava.security.egd=file:/dev/./urandom","-jar","./exam-autograder-service.jar"]