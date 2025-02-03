FROM node:22-alpine
USER root

RUN mkdir -p /app
WORKDIR /app

COPY . /app/web
WORKDIR /app/web
COPY temp-next .next
COPY temp-env .env
RUN yarn install --production --frozen-lockfile

RUN ls -a
EXPOSE 4050
CMD ["yarn", "start", "-p" , "4050"]