FROM node:20

WORKDIR /app

COPY . /app

RUN npm install
RUN npm install pm2 -g
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"] 