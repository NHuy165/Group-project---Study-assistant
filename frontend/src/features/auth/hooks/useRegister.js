import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';

export const useRegister = () => {
    // States...

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Hàm submit thông tin đến backend
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        isLoading, error,
        handleSubmit
    };
};