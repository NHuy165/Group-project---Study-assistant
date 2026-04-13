import axios from 'axios';

const API_URL = 'http://localhost:8000';

// POST: body: { username, password }
export const loginUser = async (username, password) => {
    const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

    const response = await axios.post(`${API_URL}/login`, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

// POST: body: userData
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/user/register`, userData);
    return response.data;
};