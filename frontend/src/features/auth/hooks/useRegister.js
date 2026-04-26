import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export const useRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 

  const handleUsernameChange = (e) => {
    console.log("Username:", e.target.value); // Giữ console.log của bạn
    setUsername(e.target.value);
  }

  const handleEmailChange = (e) => {
    console.log("Email:", e.target.value); // Giữ console.log của bạn
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    console.log("Password:", e.target.value); // Giữ console.log của bạn
    setPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Không cho tải lại trang
    setError("");
    setIsLoading(true); // Hiệu ứng loading cho nút bấm

    try {
      await registerUser({ username, email, password });
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login"); 
    } catch (err) {
        // 1. Nếu lỗi là 409 (Trùng Email/Username)
        if (err.response && err.response.status === 409) {
            setError("Email này đã được sử dụng. Bé thử một email khác nhé!");
        }
        // 2. Nếu lỗi là 422 (Mật khẩu quá ngắn, sai format email...)
        else if (err.response && err.response.status === 422) {
            setError("Thông tin đăng ký chưa hợp lệ (Ví dụ: Email sai định dạng)!");
        }
        // 3. Các lỗi khác
        else {
            setError(
                err?.response?.data?.detail ||
                "Đăng ký thất bại. Vui lòng thử lại sau."
            );
        }
    } finally { 
          // Tắt loading dù thành công hay thất bại
          setIsLoading(false);
        }
      };

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading,
    error,
    handleSubmit,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange
  };
};