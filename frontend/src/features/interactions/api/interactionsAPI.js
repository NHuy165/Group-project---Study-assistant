import axios from 'axios';

const API_URL = 'http://localhost:8000/interaction';

// Lấy token từ localStorage (hoặc dùng axios interceptor như đã nói)
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// POST: body: interactionData = { title, description, ... }
export const createInteraction = async (interactionData) => {
    const response = await axios.post(`${API_URL}`, interactionData, getAuthHeader());
    return response.data;
};

// GET
export const readInteractions = async () => {
    const response = await axios.get(`${API_URL}`, getAuthHeader());
    return response.data;
}

// PATCH: parameter: interactionId; body: updateData
export const updateInteraction = async (id, updateData) => {
    const response = await axios.patch(`${API_URL}/${id}`, updateData, getAuthHeader());
    return response.data;
};

// DELETE: parameter: interactionId
export const deleteInteraction = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};


