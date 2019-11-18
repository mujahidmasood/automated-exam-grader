FROM python:3.6


COPY . /
RUN sh run.sh
COPY src/app.py .
ENV GOOGLE_APPLICATION_CREDENTIALS=./src/gcloud.json
EXPOSE 5000
ENTRYPOINT ["python3", "app.py"]


#docker build -t exam-autograder-processor .
#docker run --net exam-autograder-network --name exam-autograder-processor -p 5000:5000 exam-autograder-processor