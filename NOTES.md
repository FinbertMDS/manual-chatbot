1. Cloudfront https không thể gọi http IP của EC2
2. Tạo EC2 không tự động chạy backend
3. Server chạy thủ công nhưng ko gọi được bằng Postman
4. Thêm log cho server đẩy lên cloud watch
5. Check lại các biến .env

---

6. Chạy lần đẩu thì tạo S3 bị lỗi do block access
   -> chạy lần 2 OK
7. Dùng API gateway thì ko gọi được api, nhưng gọi qua ec2 ip thì OK
