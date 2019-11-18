




#docker run --net=exam-autograder-network -p 8100:8100 -p 35729:35729 --name exam-autograder-ui exam-autograder-ui
FROM node

RUN npm install -g cordova@8.1.1 && cordova telemetry off && npm install -g ionic
EXPOSE 8100 35729

RUN mkdir code && cd code
COPY . code

WORKDIR code
RUN npm uninstall node-sass && npm install node-sass && npm install

CMD ["ionic", "serve"]
