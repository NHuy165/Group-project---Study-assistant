import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export const useRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // hiển thị khi nào thì đăng nhập
  const [error, setError] = useState(""); // nhập sai pass 
  const navigate = useNavigate(); // công cụ chuyển trang của React Router(thay cho thẻ a truyền thống)

  const handleSubmit = async (e) => {
    e.preventDefault(); // ko cho tải lại trang 
    setError("");
    setIsLoading(true); // dùng để làm mờ nút bấm 

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
    } finally { //  Dù thành công hay thất bại, cũng phải tắt trạng thái loading đi để nút bấm trở lại bình thường.
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
};
