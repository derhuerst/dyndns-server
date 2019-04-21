FROM node:alpine

WORKDIR /app
COPY . /app
RUN npm install --production

EXPOSE 53
EXPOSE 8053

ENV DNS_PORT 53
ENV HTTP_PORT 8053

CMD ["npm", "start"]
