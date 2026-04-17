import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/documentsApi';

export const useDocuments = (interactionId) => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [documentName, setDocumentName] = useState('');
    const [pageOffset, setPageOffset] = useState('');

    const handleDocumentNameChange = (e) => {
        console.log(e.target.value);
        setDocumentName(e.target.value);
    };

    const handlePageOffsetChange = (e) => {
        console.log(e.target.value);
        setPageOffset(e.target.value);
    };

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


    const readDocuments = useCallback(async () => {
        if (!interactionId) return;
        setIsLoading(true);
        try {
            const data = await api.readDocuments(interactionId);
            setDocuments(data);
        } catch (err) {
            setError("Không thể tải danh sách tài liệu");
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
            setError("Lỗi khi tải tài liệu lên");
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
            setError("Lỗi khi cập nhật thông tin tài liệu");
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
            setError("Lỗi khi xóa tài liệu");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        documents,
        isLoading,
        error,
        createDocument: handleSummit,
        updateDocument,
        deleteDocument,
        handleDocumentNameChange,
        handlePageOffsetChange
    };
};