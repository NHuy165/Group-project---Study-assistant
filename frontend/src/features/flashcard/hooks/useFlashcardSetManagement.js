import { useState, useCallback, useEffect } from 'react';
import { readAllFlashcards, createFlashcard, deleteFlashcard } from '../api/flashcardAPI';

/**
 * Hook quản lý logic bộ flashcard: load, tạo, xóa
 * @param {string} interactionId - ID của interaction
 * @returns {Object} - flashcardSets, isLoading, error, methods
 */
const useFlashcardSetManagement = (interactionId) => {
    const [flashcardSets, setFlashcardSets] = useState([]); // danh sách các bộ flashcard
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [prompt, setPrompt] = useState('');

    /**
     * Tải toàn bộ flashcards từ backend
     */
    const loadFlashcardSets = useCallback(async () => {
        if (!interactionId) return;

        setIsLoading(true);
        setError('');
        try {
            const response = await readAllFlashcards(interactionId);
            const data = Array.isArray(response) ? response : [];
            setFlashcardSets(data);
        } catch (err) {
            console.error("Lỗi tải flashcard:", err);
            setError("Không thể tải flashcard");
            setFlashcardSets([]);
        } finally {
            setIsLoading(false);
        }
    }, [interactionId]);

    /**
     * Tạo flashcard mới từ prompt
     */
    const createNewFlashcardSet = useCallback(async (prompt) => {
        if (!prompt.trim() || !interactionId) {
            setError('Vui lòng nhập nội dung');
            return null;
        }

        setIsLoading(true);
        setError('');
        try {
            // createFlashcard trả về array of { id, front, back, ... }
            const newFlashcardSet = await createFlashcard(interactionId, { prompt });

            await loadFlashcardSets();

            setPrompt('');
            return newFlashcardSet;

        } catch (err) {
            console.error("Lỗi tạo flashcard:", err);
            setError("Lỗi tạo flashcard. Vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
        return null;
    }, [interactionId, loadFlashcardSets]);

    /**
     * Xóa flashcard
     */
    const removeFlashcardSet = useCallback(async (study_activity_id) => {
        try {
            // Gọi API xóa trước
            await deleteFlashcard(study_activity_id);
            // Xóa từ local state
            setFlashcardSets(prev => prev.filter(set => set.id !== study_activity_id))
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
            loadFlashcardSets();
        }
    }, [interactionId, loadFlashcardSets]);

    return {
        flashcardSets, 
        setFlashcardSets, // Để component có thể update nếu cần
        isLoading,
        error,
        prompt, 
        setPrompt,
        loadFlashcardSets,
        createNewFlashcardSet,
        removeFlashcardSet,
    };
};

export default useFlashcardSetManagement;
