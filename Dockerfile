FROM node:20
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY src ./src
COPY tsconfig.json CONFIG.json bot.ts ./

RUN npm install
CMD npm run start