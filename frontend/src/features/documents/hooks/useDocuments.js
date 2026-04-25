import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/documentsApi';

export const useDocuments = (interactionId) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocIds, setSelectedDocIds] = useState([]);
    const [editingID, setEditingID] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStartEdit = (doc) => {
        setEditingID(doc.id);
        const dotIndex = doc.name.lastIndexOf('.');
        const baseName = dotIndex !== -1 ? doc.name.substring(0, dotIndex) : doc.name;
        setDocumentName(baseName);
    };

    const updateDocument = async (id, customFullName = null) => {
        const doc = documents.find(d => d.id === id);
        if (!doc) return setEditingID(null);

        const dotIndex = doc.name.lastIndexOf('.');
        const ext = dotIndex !== -1 ? doc.name.substring(dotIndex) : '';
        const newFullName = customFullName || (documentName.trim() ? documentName.trim() + ext : doc.name);

        if (!newFullName.trim() || newFullName === doc.name) {
            return setEditingID(null);
        }

        try {
            setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, name: newFullName } : d));
            setEditingID(null);
            await api.updateDocument(id, { name: newFullName });
        } catch (err) { 
            // Xử lý lỗi (nếu cần)
        }
    };

    const uploadMultipleFiles = async (files, input) => {
        for (const file of files) {
            const tempDoc = { id: `temp-${Date.now()}`, name: file.name, isUploading: true };
            setDocuments(prev => [...prev, tempDoc]);
            try {
                const newDoc = await api.saveDocument(interactionId, file, input);
                setDocuments(prev => prev.map(d => d.isUploading && d.name === file.name ? newDoc : d));
            } catch (err) { 
                setDocuments(prev => prev.filter(d => !d.isUploading)); 
            }
        }
    };

    const readDocuments = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true); // Nhớ bật loading
        try {
            const data = await api.readDocuments(interactionId);
            setDocuments(data);
        } catch (err) {
            console.error("Lỗi tải tài liệu:", err);
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => { 
        // Dọn dẹp danh sách cũ ngay lập tức khi ID thay đổi để tránh hiển thị nhầm
        setDocuments([]); 
        setSelectedDocIds([]);
        
        if (interactionId) {
            readDocuments(); 
        }
    }, [interactionId, readDocuments]);

    // CHỈNH SỬA: Hàm xóa file hoàn chỉnh
    const deleteDocument = async (id) => {
        try {
            // 1. Cập nhật UI ngay lập tức (xóa khỏi danh sách)
            setDocuments((prev) => prev.filter(doc => doc.id !== id));
            
            // 2. Nếu file này đang được tích chọn để chat, thì bỏ chọn luôn
            setSelectedDocIds((prev) => prev.filter(docId => docId !== id));

            // 3. Gọi API để xóa dưới database
            await api.deleteDocument(id);
        } catch (err) {
            console.error("Lỗi khi xóa tài liệu:", err);
            // Nếu gọi API lỗi, tự động tải lại danh sách file cho chắc ăn
            readDocuments();
        }
    };

    return { 
        documents, 
        selectedDocIds, 
        editingID, 
        documentName, 
        setDocumentName, 
        handleDocCheck: (id) => setSelectedDocIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]),
        handleStartEdit, 
        updateDocument, 
        uploadMultipleFiles, 
        deleteDocument // Đã thay thế hàm gọi API trực tiếp bằng hàm tự viết ở trên
    };
};