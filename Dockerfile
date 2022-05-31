FROM node:17
WORKDIR /
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
CMD ["npm", "start"]