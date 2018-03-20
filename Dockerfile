FROM mhart/alpine-node:9

WORKDIR /app

RUN apk add --no-cache make gcc g++ python git postgresql-dev

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . . 

# CMD ["node", "app.js"] 
