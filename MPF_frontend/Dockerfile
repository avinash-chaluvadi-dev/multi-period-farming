FROM node:14

RUN mkdir -p /mpf_app

WORKDIR /mpf_app

COPY package*.json ./

RUN npm install

COPY ./mpf_app ./

EXPOSE 3000

CMD ["npm", "start"]
