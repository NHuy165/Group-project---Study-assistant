import axiosClient from '../../../api/axiosClient';

const PATH = '/document';

// POST: query: name, subject_type; body: file
export const saveDocument = async (interactionId, file, documentInput) => {
    // 1. Chỉ đưa file vào Body (FormData)
    const formData = new FormData();
    formData.append('file', file);
    
    // 2. Chuyển name và subject_type thành URL Query Parameters
    const params = new URLSearchParams();
    if (documentInput.name) params.append('name', documentInput.name);
    if (documentInput.subject_type) params.append('subject_type', documentInput.subject_type);

    // Gửi POST request với query string đính kèm
    const response = await axiosClient.post(
        `${PATH}/${interactionId}/upload?${params.toString()}`, 
        formData, 
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
    return response.data;
};

// GET: parameter: interactionId
export const readDocuments = async (interactionId) => {
    const response = await axiosClient.get(`${PATH}/${interactionId}/`);  
    return response.data;
};

// PATCH: parameter: documentId
export const updateDocument = async (documentId, updateData) => {
    const response = await axiosClient.patch(`${PATH}/${documentId}`, updateData);
    return response.data;
};

// DELETE: parameter: documentId
export const deleteDocument = async (documentId) => {
    const response = await axiosClient.delete(`${PATH}/${documentId}`);
    return response.status === 204 || response.status === 200;
};