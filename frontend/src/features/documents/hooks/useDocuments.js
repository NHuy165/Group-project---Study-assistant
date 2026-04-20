import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/documentsApi';

export const useDocuments = (interactionId) => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [documentName, setDocumentName] = useState('');
    const [pageOffset, setPageOffset] = useState('');

    const [editingID, setEditingID] = useState(null) // ID tài liệu đang được update

    // Gọi 2 lần khi người dùng up file lần đầu và khi người dùng chỉnh sửa file
    const handleDocumentNameChange = (e) => {
        console.log(e.target.value);
        setDocumentName(e.target.value);
    };

    // Gọi 2 lần khi người dùng up file lần đầu và khi người dùng chỉnh sửa file
    const handlePageOffsetChange = (e) => {
        console.log(e.target.value);
        setPageOffset(e.target.value);
    };

    // Gọi khi người dùng ấn Summit File
    const handleSummit = async(e) => {
        if (e && e.preventDefault) e.preventDefault();

        const file = fileInputRef.current.files[0];
        
        // Gom dữ liệu từ State của UI thành documentInput
        const documentInput = {
            name: documentName || file.name, 
            page_offset: parseInt(pageOffset) || 0,
        };
        await saveDocument(file, documentInput);
        
        // Reset form sau khi thành công
        setDocumentName('');
        setPageOffset('')
        fileInputRef.current.value = "";
    };

    // Hàm bắt đầu sửa: Gọi khi người dùng ấn "Chỉnh sửa" ngay tại tài liệu muốn chỉnh sửa
    const handleEditClick = (document) => {
        setEditingID(document.id);              // Đánh dấu đang sửa tài liệu nào
        setDocumentName(document.name);         // Điền tên cũ vào Input
        setPageOffset(document.page_offset.toString()); // Điền offset cũ vào Input (chuyển về string)
    };

    // Hàm hủy sửa: Gọi khi người dùng ấn "Hủy"
    const cancelEdit = () => {
        setEditingID(null);
        setDocumentName('');
        setPageOffset('');
    };

    // Hàm sửa: Gọi khi người dùng ấn "Sửa" (Sau khi đã cập nhật tên/page offset) 
    const handleUpdate = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!editingID) return;

        const updateData = {
            name: documentName,
            page_offset: parseInt(pageOffset) || 0,
        };

        await updateDocument(editingID, updateData);
        cancelEdit(); // Sửa xong thì xóa dấu vết, reset form
    };

    const readDocuments = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true);
        try {
            const data = await api.readDocuments(interactionId);
            setDocuments(data);
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
            if (status === 401) {
                setError("Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!");
                // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
            } 
            
            // 2. Lỗi 404 - Not Found (Không tìm thấy tài liệu hoặc Interaction)
            else if (status === 404) {
                setError("Tài liệu này không còn trên hệ thống nữa. Có thể nó đã bị xóa. Bé vui lòng chọn tài liệu khác nhé!");
            } 
            
            // 3. Lỗi 422 - Unprocessable Entity (Truyền sai ID của Interaction trên URL (ví dụ ID là chữ thay vì số).)
            else if (status === 422) {
                setError("Yêu cầu xem tài liệu không hợp lệ. Bé kiểm tra lại đường dẫn phiên học nhé!");
            } 
            
            // 4. Các lỗi khác (500, mất mạng, server bảo trì...)
            else {
                setError(
                    detail || "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!"
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    useEffect(() => {
        readDocuments();
    }, [readDocuments]);

    const saveDocument = async (file, documentInput) => {
        setIsLoading(true);
        try {
            const newDoc = await api.saveDocument(interactionId, file, documentInput);
            setDocuments((prev) => [...prev, newDoc]);
            return newDoc;
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            // 1. Lỗi 400 - Bad Request (Yêu cầu không hợp lệ, ví dụ: file quá lớn hoặc sai loại file)
            if (status === 400) {
                setError(detail || "File này to quá hoặc không đúng định dạng rồi. Bé chọn lại file PDF nhé!");
            } 
            
            // 2. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
            else if (status === 401) {
                setError("Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!");
                // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
            } 
            
            // 3. Lỗi 404 - Not Found (Không tìm thấy tài liệu hoặc Interaction)
            else if (status === 404) {
                setError("Hệ thống không tìm thấy phiên học này. Bé hãy tải lại trang hoặc bắt đầu phiên học mới nhé!");
            } 
            
            // 4. Lỗi 422 - Unprocessable Entity (Lỗi logic, ví dụ: thiếu file hoặc định dạng file không được hỗ trợ)
            else if (status === 422) {
                setError("Bé kiểm tra lại nhé, hình như mình chưa chọn file hoặc điền thiếu thông tin tài liệu rồi!");
            } 
            
            // 5. Các lỗi khác (500, mất mạng, server bảo trì...)
            else {
                setError(
                    detail || "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!"
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateDocument = async (documentId, updateData) => {
        setIsLoading(true);
        try {
            const updated = await api.updateDocument(documentId, updateData);
            setDocuments((prev) => prev.map(d => d.id === documentId ? updated : d));
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
            if (status === 401) {
                setError("Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!");
                // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
            } 
            
            // 2. Lỗi 404 - Not Found (Không tìm thấy tài liệu hoặc Interaction)
            else if (status === 404) {
                setError("Tài liệu này không còn trên hệ thống nữa. Có thể nó đã bị xóa. Bé vui lòng chọn tài liệu khác nhé!");
            } 
            
            // 3. Lỗi 422 - Unprocessable Entity (Tên tài liệu mới quá dài, quá ngắn hoặc chứa ký tự đặc biệt không cho phép.)
            else if (status === 422) {
                setError("Thông tin chỉnh sửa không đúng quy định, bé kiểm tra lại nhé!"); // Hiển thị quy định lúc chỉnh sửa file
            } 
            
            // 4. Các lỗi khác (500, mất mạng, server bảo trì...)
            else {
                setError(
                    detail || "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!"
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDocument = async (documentId) => {
        setIsLoading(true);
        try {
            await api.deleteDocument(documentId);
            setDocuments((prev) => prev.filter(d => d.id !== documentId));
        } catch (err) {
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            // 1. Lỗi 401 - Unauthorized (Token hết hạn hoặc chưa đăng nhập)
            if (status === 401) {
                setError("Phiên làm việc đã hết hạn. Bé vui lòng đăng nhập lại để tiếp tục nhé!");
                // Thường ở đây sẽ có thêm logic đẩy về trang login nếu cần
            } 
            
            // 2. Lỗi 404 - Not Found (Nhấn xóa 2 lần liên tiếp hoặc tài liệu đã biến mất từ trước.)
            else if (status === 404) {
                setError("Tài liệu này đã được xóa thành công từ trước đó rồi bé nhé!");
            } 
            
            // 3. Lỗi 422 - Unprocessable Entity (ID tài liệu gửi lên không đúng định dạng UUID/Integer.)
            else if (status === 422) {
                setError("Yêu cầu xóa tài liệu không thành công do thông tin nhận diện bị lỗi!");
            } 
            
            // 4. Các lỗi khác (500, mất mạng, server bảo trì...)
            else {
                setError(
                    detail || "Máy chủ đang bận một chút hoặc lỗi kết nối. Bé thử lại sau nhé!"
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        documents,
        isLoading,
        error,
        documentName,
        pageOffset,
        editingID,

        createDocument: handleSummit,
        updateDocument: handleUpdate,
        deleteDocument,
        readDocuments,
        handleDocumentNameChange,
        handlePageOffsetChange,
        handleEditClick,
        cancelEdit,
        setError // Reset Error khi người dùng tắt thông báo
    };
};