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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await registerUser({ username, email, password });
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Dang ky that bai. Vui long thu lai.",
      );
    } finally {
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
