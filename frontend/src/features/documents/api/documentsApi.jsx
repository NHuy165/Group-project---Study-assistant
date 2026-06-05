import axiosClient from '../../../api/axiosClient';

const PATH = '/document';

// POST: query: name, subject_type; body: file
export const saveDocument = async (interactionId, file, documentInput) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const params = new URLSearchParams();
    if (documentInput.name) params.append('name', documentInput.name);
    if (documentInput.subject_type) params.append('subject_type', documentInput.subject_type);

    const response = await axiosClient.post(
        `${PATH}/${interactionId}/upload?${params.toString()}`, 
        formData, 
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000 // Tăng timeout lên 60 giây để xử lý file lớn và thời gian phân tích lâu hơn của BE
        }
    );
    return response.data;
};

// GET 1: Lấy danh sách tài liệu cơ bản (Chỉ gồm tên, id, định dạng)
export const readDocuments = async (interactionId) => {
    const response = await axiosClient.get(`${PATH}/${interactionId}/`);  
    return response.data;
};

// GET 2: Lấy Full chi tiết 1 tài liệu (Có Lộ trình, Câu hỏi, Bài tập)
export const readDocumentComplete = async (interactionId, documentId) => {
    const response = await axiosClient.get(`${PATH}/${interactionId}/${documentId}`);
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