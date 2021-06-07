FROM node:latest
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV PORT=6000
EXPOSE ${PORT}
CMD [ "npm", "start" ]
