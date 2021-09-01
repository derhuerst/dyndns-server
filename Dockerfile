FROM node:16.8.0-alpine3.13

WORKDIR /app
COPY . /app
RUN npm install --production

EXPOSE 53
EXPOSE 80

ENV DNS_PORT 53
ENV HTTP_PORT 80

CMD ["npm", "start"]
