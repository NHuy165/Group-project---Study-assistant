import axiosClient from '../../../api/axiosClient';

const PATH = '/document';

// POST: parameter: interactionId; body: file, name, description, subject
export const saveDocument = async (interactionId, file, documentInput) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', documentInput.name);
    formData.append('description', documentInput.description || '');
    
    // THÊM DÒNG NÀY ĐỂ GỬI MÔN HỌC LÊN SERVER
    if (documentInput.subject) {
        formData.append('subject', documentInput.subject);
    }

    const response = await axiosClient.post(
        `${PATH}/${interactionId}/upload`, 
        formData, 
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
    return response.data;
};

// GET: parameter: interactionId - THÊM / CUỐI
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
    return response.data;
};