FROM node:10

#Create app directory
WORKDIR /usr/src/foodops

#Install app dependencies
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm","start","--host","0.0.0.0"]
