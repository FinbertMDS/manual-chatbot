# Sử dụng image Node.js Alpine chính thức
FROM node:20-alpine

# Cài đặt bash vì Alpine không có sẵn bash
RUN apk add --no-cache bash

# Cài đặt PM2 toàn cục
RUN npm install -g pm2

# Tạo thư mục ứng dụng
WORKDIR /app

# Sao chép và cài đặt dependencies
COPY package*.json ./
RUN npm install --production

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng ứng dụng (ví dụ: 3001)
EXPOSE 3001

# Khởi động ứng dụng bằng pm2-runtime
CMD ["pm2-runtime", "ecosystem.config.js"]
