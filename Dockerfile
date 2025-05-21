FROM node:20
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json CONFIG.json ./

RUN npm run start