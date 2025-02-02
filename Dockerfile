FROM node:20 AS node-builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=node-builder /app/dist /usr/share/nginx/html
COPY ./.htpasswd /etc/nginx/.htpasswd
COPY ./ngnix.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
