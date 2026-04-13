import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

export const useLogin = () => {
    // States...
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginUser(email, password);
            // Xử lý kết quả đăng nhập, ví dụ: lưu token, chuyển hướng
            localStorage.setItem('token', data.access_token);
            navigate('/dashboard'); // Chuyển hướng sau khi đăng nhập thành công
        } catch (err) {
            setError(err.response?.data?.detail || 'Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        isLoading, error,
        handleSubmit
    };
};