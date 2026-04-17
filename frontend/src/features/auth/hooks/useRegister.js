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
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Đăng kí thất bại, vui lòng thử lại.",
      );
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