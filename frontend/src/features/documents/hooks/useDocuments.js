import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/documentsApi';


export const useDocuments = (interactionId) => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDocIds, setSelectedDocIds] = useState([]);
    const [error, setError] = useState(null);
    const [editingID, setEditingID] = useState(null);
    const [documentName, setDocumentName] = useState('');

    const handleDocCheck = (docId) => {
        setSelectedDocIds((prev) => 
            prev.includes(docId) 
                ? prev.filter(id => id !== docId) // Nếu đã có thì bỏ chọn
                : [...prev, docId]               // Nếu chưa có thì thêm vào
        );
    };

    // Đọc danh sách tài liệu của phiên hiện tại
    const readDocuments = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true);
        try {
            const data = await api.readDocuments(interactionId);
            setDocuments(data);
        } catch (err) {
            // Logic xử lý lỗi "Bé ơi..." như bạn đã code
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => {
        readDocuments();
    }, [readDocuments]);

    // Hàm upload tài liệu mới lên Backend
   // Sửa hàm upload thành chuyên biệt cho 1 file đơn lẻ
    const uploadSingleFile = async (file, documentInput) => {
        if (!interactionId) {
            setError("Bé cần chọn cuộc trò chuyện để tớ biết lưu file vào đâu nhé!");
            return;
        }

        setIsLoading(true);
        try {
            // Mặc định tạo metadata nếu documentInput bị trống
            const finalInput = documentInput || { name: file.name, description: "" };
            
            const newDoc = await api.saveDocument(interactionId, file, finalInput);
            
            // Cập nhật danh sách để file hiện lên Sidebar ngay
            setDocuments((prev) => [...prev, newDoc]);
            return newDoc;
        } catch (err) {
            setError("Ôi, tớ không tải được tệp " + file.name + " rồi!");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        documents, selectedDocIds, handleDocCheck, isLoading, error, documentName, setDocumentName,
        editingID, setEditingID,
        uploadSingleFile,
        deleteDocument: async (id) => {/* logic deleteDocument */},
        updateDocument: async (id, data) => {/* logic updateDocument */},
        setError
    };
};