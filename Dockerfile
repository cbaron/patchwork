FROM mhart/alpine-node:9

WORKDIR /app

RUN apk add --no-cache make gcc g++ python git postgresql-dev

COPY package*.json ./
RUN npm install  #The mhart/alpine-node image includes npm

COPY . . 

# Set the port that the node app will run on
ENV HTTP_PORT 4000

EXPOSE $HTTP_PORT

# CMD ["node", "app.js"] 
