# Group-project---Study-assistant


# Cách chạy project tạm thời:
- Bước 1: Clone project về.
- Bước 2: Tạo 1 file mang tên .env theo định dạng tương tự như file .env.example ở cùng vị trí. Lưu ý API key cần được lấy thủ công từ Google AI Studio.
- Bước 3: Nếu chưa tải docker. Tải ở trang trang 'https://docs.docker.com/desktop/setup/install/windows-install/' (thường sẽ dùng Docker Desktop for Windows - x86_64). Kiểm tra installation bằng docker --version trong VSCode terminal.
- Bước 4: 
  + Để chạy, nhập "docker compose up --build" (nếu là lần chạy đầu tiên hoặc mới update file requirements.txt) hoặc "docker compose up" (cho các lần chạy tiếp theo) trong VSCode terminal.
  + Vào link http://localhost:8000/docs
  + Các endpoint có thể được chạy bằng việc click vào và click 'Try it out'.
  + Nếu là lần đầu tiên chạy, register ở endpoint /users/register.
  + Trước khi chạy các endpoint trong tag 'study', cần login tại nút Authorize (có thể tìm gần đầu trang).
  + Endpoint /study/sources/{file_name} cho phép embed và lưu 1 file. File này cần được lưu thủ công trong backend/src/services/study/NEED_READ_FILES_GO_HERE/
  + Endpoint /study/ask cho phép hỏi các thông tin về tất cả các file đã lưu.
- Bước 5: Khi xong, click vào terminal đang chạy và nhấn Ctrl + C