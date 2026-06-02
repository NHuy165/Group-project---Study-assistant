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

    const uploadMultipleFiles = async (fileItems) => {
        // 1. Tạo danh sách file "ảo" hiển thị UI trạng thái "isUploading" ngay lập tức
        const tempDocs = fileItems.map((item, index) => ({ 
            id: `temp-${Date.now()}-${index}`, 
            name: item.file.name, 
            subject: item.subject, // Lưu môn học tạm thời để hiển thị UI (nếu cần)
            isUploading: true 
        }));
        
        // Thêm các file mới vào ĐẦU danh sách
        setDocuments(prev => [...tempDocs, ...prev]);

        // 2. Chạy tải lên SONG SONG tất cả các file cùng một lúc (All at once)
        await Promise.all(
            fileItems.map(async (item, index) => {
                const tempId = tempDocs[index].id;
                
                try {
                    // Đóng gói input riêng cho từng file (bao gồm tên và môn học)
                    const documentInput = {
                        name: item.file.name,
                        subject: item.subject // <-- Lấy đúng môn học bé đã chọn cho file này
                    };

                    const newDoc = await api.saveDocument(interactionId, item.file, documentInput);
                    
                    // Cập nhật lại UI khi file NÀY tải xong (thay thế file ảo bằng file thật từ server)
                    setDocuments(prev => prev.map(d => 
                        d.id === tempId ? newDoc : d
                    ));
                } catch (err) { 
                    console.error(`Lỗi tải lên file ${item.file.name}:`, err);
                    // Nếu file này lỗi, cập nhật trạng thái isError = true để UI chuyển màu đỏ
                    setDocuments(prev => prev.map(d => 
                        d.id === tempId ? { ...d, isUploading: false, isError: true } : d
                    )); 
                }
            })
        );
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