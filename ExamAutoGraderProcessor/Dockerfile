FROM python:3.11-slim

# Runtime library required by opencv-python-headless.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY . /
RUN pip3 install --no-cache-dir -r /requirements.txt
ENV GOOGLE_APPLICATION_CREDENTIALS=./src/gcloud.json
EXPOSE 5000
WORKDIR /
# Run as a module so the "from src.grader import ..." imports resolve.
CMD ["python3", "-m", "src.app"]


#docker build -t exam-autograder-processor .
#docker run --net exam-autograder-network --name exam-autograder-processor -p 5000:5000 exam-autograder-processor
