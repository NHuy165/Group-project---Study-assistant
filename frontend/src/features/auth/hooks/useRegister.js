import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';

export const useRegister = () => {
    // States...
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        console.log(e.target.value);
        setUsername(e.target.value);
    }

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
            const userData = { username, email, password };
            await registerUser(userData);
            // Chuyển hướng sau khi đăng ký thành công
            alert('Đăng ký thành công! Hãy đăng nhập.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Đăng ký thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        isLoading, error,
        handleSubmit,
        handleUsernameChange,
        handleEmailChange,
        handlePasswordChange
    };
};