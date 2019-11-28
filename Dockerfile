FROM node:10

#Create app directory
WORKDIR /foodops

#Install app dependencies
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .

EXPOSE 8080
CMD ["node","app.js","--host","0.0.0.0"]
