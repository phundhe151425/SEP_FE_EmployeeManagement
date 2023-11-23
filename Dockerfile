
FROM node:16.16.0 as build-stage
# Sử dụng base image có sẵn chứa Node.js

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock) vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
COPY ./ .

# # Xây dựng ứng dụng Vue.js
# RUN npm run build

# EXPOSE 8080

# Thiết lập lệnh mặc định khi container chạy
# CMD ["npm", "run", "serve"]

RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



#FROM node:16.16.0 as build-stage
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY ./ .
#RUN npm run build
#
#FROM nginx as production-stage
#RUN mkdir /app
#COPY --from=build-stage /app/dist /app
#COPY nginx.conf /nginx/nginx.conf
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

