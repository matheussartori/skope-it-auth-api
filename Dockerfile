FROM node:18
WORKDIR /usr/src/auth-api
COPY . .
EXPOSE 3333
EXPOSE 9229
ENV WAIT_VERSION 2.12.1
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
