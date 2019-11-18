#!/bin/bash

docker network create exam-autograder-network
docker-compose up --build
