# Group-project---Study-assistant


# Cách chạy project tạm thời:
- Bước 1: Clone project về, tải các thư viện trong requirements.txt, tài postgresql về (nhớ tải cả PgAdmin).
- Bước 2: Tạo 1 database trong postgresql.
- Bước 3: Tạo 1 file ở ngoài cùng của project (ngang hàng với tệp backend) và đặt tên là .env, định dạng như sau:

POSTGRES_URL = postgresql+asyncpg://<user>:<password>@<host>:<port>/<database>
# user: Tên user, mặc định là postgresql.
# password: Password của postgresql.
# host: Mặc định là localhost.
# port: Mặc định là 5432.
# database: Tên database tạo ở bước 2.
API_KEY_GEMINI = <API key, xem cách lấy ở google studio>
PRIVATE_KEY = <Chạy openssl rand -hex 32 trong terminal rồi paste cái mã vô>

JWT_ALGORITHM = HS256 # Để y nguyên
DEFAULT_CHUNK_SIZE = 500 # Số character trong 1 chunk (RAG)
DEFAULT_CHUNK_OVERLAP = 50 # Số character 2 chunk liền kề overlap (RAG)
TOKEN_EXPIRY_HOURS = 72 # Thời gian valid của 1 phiên đăng nhập.

File mẫu:
POSTGRES_URL = postgresql+asyncpg://postgres:Q6L0N2H0LQS5016SQL5888@localhost:5432/group_project_sample
API_KEY_GEMINI = AIzaSyDONEz7vDXOWpkngfFe0bLr8kv0qddUSiI
PRIVATE_KEY = 2aac7fad1caf56e547cffa20e6d8a849d84923ae4b8323f098738fb65e929d45

JWT_ALGORITHM = HS256
DEFAULT_CHUNK_SIZE = 500
DEFAULT_CHUNK_OVERLAP = 50
TOKEN_EXPIRY_HOURS = 72

- Bước 4: Mở ứng dụng x64 Native Tools Command Prompt for VS [version] trên máy tính bằng administrator và chạy đoạn này:
set "PGROOT=C:\Program Files\PostgreSQL\18"
cd %TEMP%
git clone --branch v0.8.2 https://github.com/pgvector/pgvector.git
cd pgvector
nmake /F Makefile.win
nmake /F Makefile.win install

- Bước 5: Chạy web bằng fastapi dev backend/src/main.py, sau đó vào http://127.0.0.1:8000/docs. Các đường dẫn được chạy bằng cách bấm vào và bấm nút 'Try it out'.