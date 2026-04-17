import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const handleEmailChange = (e) => {
        console.log(e.target.value);
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        console.log(e.target.value);
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginUser(email, password);
            // Xử lý kết quả đăng nhập, ví dụ: lưu token, chuyển hướng
            localStorage.setItem('token', data.access_token); // Lưu token vào LocalStorage
            navigate('/dashboard'); // Chuyển hướng sau khi đăng nhập thành công
        } catch (err) {
            // 1. Nếu lỗi là 401 (Sai thông tin đăng nhập)
            if (err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu chưa đúng. Bé kiểm tra lại nhé!");
            } 
            // 2. Nếu lỗi là 422 (Dữ liệu gửi lên bị thiếu hoặc sai định dạng)
            else if (err.response && err.response.status === 422) {
                setError("Thông tin nhập vào chưa hợp lệ!");
            } 
            // 3. Các lỗi khác (Server sập, mất mạng...)
            else {
                // Ưu tiên lấy chi tiết lỗi từ backend gửi về, nếu không có thì báo câu chung chung
                // ĐÃ XÓA `err.message` để không bị hiện dòng chữ tiếng Anh "Request failed..."
                setError(
                    err?.response?.data?.detail ||
                    "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau."
                );
            }
        } finally {
                    setIsLoading(false);
                }
            };

    return {
        email, setEmail,
        password, setPassword,
        isLoading, error,
        handleSubmit,
        handleEmailChange,
        handlePasswordChange
    };
};

