FROM node:18.20.0

WORKDIR /app

COPY package.json ./
RUN yarn --production --ignore-scripts --prefer-offline --network-timeout 100000

WORKDIR /app
COPY temp-env .env
COPY . .
RUN rm -rf .next
RUN mv temp-next .next

EXPOSE 4001

CMD ["yarn", "start"]

# USER root

# RUN mkdir -p /app
# WORKDIR /app

# COPY . /app/web
# WORKDIR /app/web
# COPY temp-next .next
# COPY temp-env .env
# RUN yarn --production --ignore-scripts --prefer-offline --network-timeout 180000
# EXPOSE 4050
# CMD ["yarn", "start", "-p" , "4050"]