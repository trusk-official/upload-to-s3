FROM node:latest
COPY index.js index.js
COPY package.json package.json
RUN npm install
ENTRYPOINT ["node","index.js"]
