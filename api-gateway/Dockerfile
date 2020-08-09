FROM node:12-alpine as build

WORKDIR /usr/share/api-gateway

COPY dist package.json ./

RUN npm install --production

FROM node:12-alpine

WORKDIR /usr/share/api-gateway

COPY --from=build /usr/share/api-gateway .

EXPOSE 3000

#用于远程调试
CMD  node --inspect=0.0.0.0:9229 dist/main.js
