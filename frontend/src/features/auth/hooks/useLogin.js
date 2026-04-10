import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

export const useLogin = () => {
    // States...

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Hàm submit thông tin đến backend
    };

    return {
        email, setEmail,
        password, setPassword,
        isLoading, error,
        handleSubmit
    };
};