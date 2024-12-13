FROM node:19
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5002
CMD ["./node_modules/.bin/nodemon", "playerInfoService.js"]