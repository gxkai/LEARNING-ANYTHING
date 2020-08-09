FROM node:12-alpine as build

RUN npm config set registry https://registry.npm.taobao.org

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /usr/share/mailer-svc

ADD dist package.json ./

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install --production

FROM node:12-alpine

ADD ./grpc_health_probe-linux-amd64 /bin/grpc_health_probe

RUN chmod +x /bin/grpc_health_probe

WORKDIR /usr/share/mailer-svc

COPY --from=build /usr/share/mailer-svc .

EXPOSE 50051

CMD ["node", "main.js"]
