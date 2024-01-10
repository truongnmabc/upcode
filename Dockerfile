# FROM node:16.15.1
# USER root

# RUN mkdir -p /root/.ssh
# ADD ./ssh_keys/id_rsa /root/.ssh/id_rsa
# RUN chmod 700 /root/.ssh/id_rsa
# RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config
# RUN mkdir -p /usr/src/web
# WORKDIR /usr/src/web

# # Installing dependencies
# # RUN apk update
# # RUN apk add --no-cache python2 g++ make git
# # RUN apk --no-cache --virtual build-dependencies add python2 make g++
# # RUN apk add --update python make g++ && rm -rf /var/cache/apk/*
# RUN apt-get update
# RUN apt-get install git
# RUN apt-get install jq -y
# RUN apt-get update -y
# ADD https://www.google.com /time.now
# RUN git clone git@github.com:Elearning-ABC/cdl.git
# WORKDIR /usr/src/web/cdl
# RUN chmod 700 ./build.sh

# ARG CURRENT_BRANCH=${CURRENT_BRANCH}
# ENV CURRENT_BRANCH=${CURRENT_BRANCH}

# ARG CURRENT_APP=${CURRENT_APP}
# ENV CURRENT_APP=${CURRENT_APP}

# RUN touch ./.env.local
# RUN echo $CURRENT_BRANCH
# RUN git checkout ${CURRENT_BRANCH}
# RUN ./build.sh ${CURRENT_APP}
# RUN yarn build 
# EXPOSE 4050
# CMD ["yarn", "start", "-p" , "4050"]

FROM node:16.15.1
USER root

RUN mkdir -p /app
WORKDIR /app

COPY . /app/cdl
WORKDIR /app/cdl
COPY temp-next .next
COPY temp-env .env
RUN yarn install

RUN ls -a
EXPOSE 4050
CMD ["yarn", "start", "-p" , "4050"]