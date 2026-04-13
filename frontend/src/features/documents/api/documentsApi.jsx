// saveDocument, readDocuments, updateDocument, deleteDocument

import axios from 'axios';

const API_URL = 'http://localhost:8000/document';

const getAuthHeader = () => ({
    headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        // Khi gửi file, Axios sẽ tự động set Content-Type là multipart/form-data
    }
});

// POST: parameter: interactionId; body: file, documentInput (metadata)
export const saveDocument = async (interactionId, file, documentInput) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
        `${API_URL}/${interactionId}/upload`, 
        formData, 
        {
            ...getAuthHeader(),
            params: documentInput // Truyền metadata của document qua query string
        }
    );
    return response.data;
};

// GET: parameter: interactionId
export const readDocuments = async (interactionId) => {
    const response = await axios.get(`${API_URL}/${interactionId}/`, getAuthHeader());
    return response.data;
};

// PATCH: parameter: documentId; body: updateData (có thể là file mới hoặc metadata mới)
export const updateDocument = async (documentId, updateData) => {
    const response = await axios.patch(`${API_URL}/${documentId}`, updateData, getAuthHeader());
    return response.data;
};

// DELETE: parameter: documentId
export const deleteDocument = async (documentId) => {
    const response = await axios.delete(`${API_URL}/${documentId}`, getAuthHeader());
    return response.data;
};