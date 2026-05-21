FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_pwd=password

RUN mkdir -p /home/app

COPY . /home/app

CMD ["node", "server.js"]

