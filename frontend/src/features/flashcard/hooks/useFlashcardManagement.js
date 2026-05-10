import { useState, useCallback, useEffect } from 'react';
import { readAllFlashcards, createFlashcard, deleteFlashcard } from '../api/flashcardAPI';

/**
 * Hook quản lý logic flashcard: load, tạo, xóa
 * @param {string} interactionId - ID của interaction
 * @returns {Object} - flashcards, isLoading, error, methods
 */
const useFlashcardManagement = (interactionId) => {
    const [flashcards, setFlashcards] = useState([]); // danh sách card
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [prompt, setPrompt] = useState('');

    /**
     * Tải toàn bộ flashcards từ backend
     */
    const loadFlashcards = useCallback(async () => {
        if (!interactionId) return;

        setIsLoading(true);
        setError('');
        try {
            const response = await readAllFlashcards(interactionId);
            const data = Array.isArray(response) ? response : [];
            setFlashcards(data);
        } catch (err) {
            console.error("Lỗi tải flashcard:", err);
            setError("Không thể tải flashcard");
            setFlashcards([]);
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    /**
     * Tạo flashcard mới từ prompt
     */
    const createNewFlashcard = useCallback(async (prompt) => {
        if (!prompt.trim() || !interactionId) {
            setError('Vui lòng nhập nội dung');
            return null;
        }

        setIsLoading(true);
        setError('');
        try {
            // createFlashcard trả về array of { id, front, back, ... }
            const newFlashcards = await createFlashcard(interactionId, { prompt });
            
            if (Array.isArray(newFlashcards) && newFlashcards.length > 0) {
                // Thêm flashcard mới vào danh sách
                setFlashcards(prev => [...prev, ...newFlashcards]);
                return newFlashcards;
            }
        } catch (err) {
            console.error("Lỗi tạo flashcard:", err);
            setError("Lỗi tạo flashcard. Vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
        return null;
    }, [interactionId]);

    /**
     * Xóa flashcard
     */
    const removeFlashcard = useCallback(async (flashcardId) => {
        try {
            // Gọi API xóa trước
            await deleteFlashcard(flashcardId);
            // Xóa từ local state
            setFlashcards(prev => prev.filter(card => card.id !== flashcardId));
            setError('');
        } catch (err) {
            console.error("Lỗi xóa flashcard:", err);
            setError("Lỗi xóa flashcard");
        }
    }, []);

    /**
     * Tự động tải flashcards khi interactionId thay đổi
     */
    useEffect(() => {
        if (interactionId) {
            loadFlashcards();
        }
    }, [interactionId, loadFlashcards]);

    return {
        flashcards, 
        setFlashcards, // Để component có thể update nếu cần
        isLoading,
        error,
        prompt, 
        setPrompt,
        loadFlashcards,
        createNewFlashcard,
        removeFlashcard,
    };
};

export default useFlashcardManagement;
