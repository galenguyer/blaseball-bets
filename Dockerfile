FROM node:12.16.2 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
RUN yarn browserslist --update-db
COPY . ./
RUN yarn build

FROM docker.galenguyer.com/nginx-auto/nginx-react
COPY --from=build-deps /usr/src/app/build /var/www/html/bets
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo 'ok' > /var/www/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
