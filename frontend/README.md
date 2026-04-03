# Hướng dẫn chạy tạm thời
## 1. Cài đặt môi trường
- FE sử dụng Node.js, do đó nếu chưa có sẵn thì cài đặt Node.js (phiên bản 18.x hoặc mới hơn) từ [trang chính thức của Node.js](https://nodejs.org/).
- Bước 1: Mở terminal và di chuyển đến thư mục <<tên thư mục FE>>
- Bước 2: Chạy lệnh `npm install` để cài đặt tất cả các dependencies cần thiết.
- Bước 3: Sau khi cài đặt xong, chạy lệnh `npm run dev` để khởi động ứng dụng. Mặc định, ứng dụng sẽ chạy trên `http://localhost:5173/`, nếu cổng này đã được sử dụng, Vite sẽ tự động chọn một cổng khác (thường là 5174).

## 2. Thiết lập biến môi trường trong file .env
Tạo file `.env` trong thư mục gốc của dự án (nếu chưa có) và thêm các biến môi trường sau:
- VITE_API_URL=http://localhost:8000
- VITE_MY_TOKEN="Điền vào token của bạn"
- VITE_INTERACTION_ID="Điền vào interactionId của bạn"

## 3. Quy trình để có Token và Interaction ID
- Chạy Backend: Đảm bảo Docker Backend đã up thành công.
- Tạo user&login:
    - Truy cập http://localhost:8000/docs.
    - Dùng /user/register để tạo tài khoản (nếu DB trống).
    - Dùng /login để lấy chuỗi Access Token.
- Tạo Interaction:
    - Dùng /interaction/create để tạo một phiên làm việc mới.
    - Lấy số ID trả về (ví dụ: 1, 2, 3...).
- Cập nhật vào code: Điền token và interactionId vào file .env như đã hướng dẫn ở bước 2.

## 4. Lưu ý về cấu hình CORS
Nếu FE chạy ở địa chỉ khác (ví dụ: cổng khác 5173, 5174) thì cần cấu hình CORS trên Backend để cho phép truy cập từ các nguồn khác.
Để chỉnh sửa, truy cập backend/src/main.py và thêm địa chỉ của FE vào origins.