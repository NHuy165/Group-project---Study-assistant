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
            prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
        );
    };

    const readDocuments = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true);
        try {
            const data = await api.readDocuments(interactionId);
            console.log("📥 Documents from API:", data); 
            setDocuments(data);
        } catch (err) {
            setError("Không tải được danh sách tài liệu.");
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => { readDocuments(); }, [readDocuments]);

    const uploadSingleFile = async (file, documentInput) => {
        if (!interactionId) {
            setError("Bé cần chọn cuộc trò chuyện để tớ biết lưu file vào đâu nhé!");
            return;
        }

        // --- BƯỚC 1: TẠO FILE ẢO VÀ CHO HIỆN LÊN SIDEBAR NGAY LẬP TỨC ---
        const tempId = `temp-${Date.now()}-${file.name}`;
        const tempDoc = {
            id: tempId,
            name: file.name,
            created_at: new Date().toISOString(),
            isUploading: true
        };

        setDocuments((prev) => [...prev, tempDoc]);
        setIsLoading(true);

        try {
            const finalInput = documentInput || { name: file.name, description: "" };
            
            // --- BƯỚC 2: ÂM THẦM GỌI API ---
            const newDoc = await api.saveDocument(interactionId, file, finalInput);
            
            // --- BƯỚC 3: API XONG -> THAY THẾ FILE ẢO BẰNG FILE THẬT ---
            setDocuments((prev) => 
                prev.map((doc) => doc.id === tempId ? newDoc : doc)
            );
            return newDoc;
        } catch (err) {
            // Nếu lỗi 500 (Internal Server Error) - có thể file đã lưu thành công
            // Thay vì xóa, ta gọi lại API để lấy dữ liệu mới nhất
            if (err.response?.status === 500) {
                console.warn("API lỗi 500 nhưng file có thể đã lưu, gọi lại readDocuments...");
                await readDocuments(); // Lấy lại danh sách từ server
            } else {
                // Các lỗi khác thì xóa file ảo
                setDocuments((prev) => prev.filter((doc) => doc.id !== tempId));
                setError("Ôi, tớ không tải được tệp " + file.name + " rồi!");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const uploadMultipleFiles = async (files, documentInput) => {
        const results = [];
        for (const file of files) {
            const result = await uploadSingleFile(file, documentInput);
            if (result) results.push(result);
        }
        return results;
    };
    
    const updateDocument = async (id) => {
        if (!documentName.trim()) {
            setEditingID(null);
            return;
        }

        try {
            const newName = documentName; // Lưu tên mới vào biến tạm

            setDocuments((prev) =>
                prev.map((doc) => 
                    doc.id === id ? { ...doc, name: newName } : doc
                )
            );

            setEditingID(null);
            setDocumentName('');

            // Gọi API để Backend lưu vào DB
            await api.updateDocument(id, { name: newName });
            
        } catch (err) {
            setError("Không đổi được tên.");
            setEditingID(null);
        }
    };

    // --- HÀM XÓA TÀI LIỆU ĐƯỢC THÊM VÀO TỪ LOGIC CŨ ---
    const deleteDocument = async (documentId) => {
        setIsLoading(true);
        try {
            await api.deleteDocument(documentId);
            
            // Cập nhật danh sách hiển thị
            setDocuments((prev) => prev.filter(d => d.id !== documentId));
            
            // Bỏ chọn ô Checkbox nếu file bị xóa đang được tích
            setSelectedDocIds((prev) => prev.filter(id => id !== documentId));
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            if (status === 401) {
                setError("Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!");
            } else if (status === 404) {
                setError("Tài liệu này đã được xóa thành công từ trước đó rồi bé nhé!");
                // Nếu lỗi 404 tức là không còn trên server, cũng dọn dẹp khỏi giao diện luôn
                setDocuments((prev) => prev.filter(d => d.id !== documentId));
            } else if (status === 422) {
                setError("Yêu cầu xóa tài liệu không thành công do thông tin nhận diện bị lỗi!");
            } else {
                setError(detail || "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        documents, selectedDocIds, handleDocCheck, isLoading, error, documentName, setDocumentName,
        uploadMultipleFiles, uploadSingleFile, editingID, setEditingID, updateDocument, setError,
        deleteDocument // Đã gán hàm xóa chuẩn vào đây
    };
};