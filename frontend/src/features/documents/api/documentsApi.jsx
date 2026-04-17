import axiosClient from '../../../api/axiosClient';

const PATH = '/document';

// POST: parameter: interactionId; body: file, documentInput (metadata)
export const saveDocument = async (interactionId, file, documentInput) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post(
        `${PATH}/${interactionId}/upload`, 
        formData, 
        {
            params: documentInput, // Truyền metadata của document qua query string
            // Để Axios tự xử lý Content-Type cho FormData
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
    return response.data;
};

// GET: parameter: interactionId
export const readDocuments = async (interactionId) => {
    const response = await axiosClient.get(`${PATH}/${interactionId}`);
    return response.data;
};

// PATCH: parameter: documentId; body: updateData (có thể là file mới hoặc metadata mới)
export const updateDocument = async (documentId, updateData) => {
    const response = await axiosClient.patch(`${PATH}/${documentId}`, updateData);
    return response.data;
};

// DELETE: parameter: documentId
export const deleteDocument = async (documentId) => {
    const response = await axiosClient.delete(`${PATH}/${documentId}`);
    return response.data;
};