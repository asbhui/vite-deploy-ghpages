FROM node:20 AS node-builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=node-builder /app/dist /usr/share/nginx/html
COPY ./.htpasswd /etc/nginx/.htpasswd
COPY ./ngnix.conf /etc/nginx/conf.d/default.conf
EXPOSE 80