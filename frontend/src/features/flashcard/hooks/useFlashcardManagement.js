import { useState, useCallback, useEffect } from 'react';
import { readFlashcard, addCard, updateFlashcard, deleteCard } from '../api/flashcardAPI';

/**
 * Hook quản lý logic flashcard: load, tạo, xóa
 * @param {string} study_activity_id - ID của interaction
 * @returns {Object} - cardsList, isLoading, error, methods
 */
const useFlashcardManagement = (study_activity_id) => {
    const [cardsList, setCardsList] = useState([]); // danh sách card
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Tải toàn bộ thẻ từ một bộ flashcard
     */
    const loadFlashcards = useCallback(async () => {
        if (!study_activity_id) return;

        setIsLoading(true);
        setError('');
        try {
            const response = await readFlashcard(study_activity_id);
            const data = Array.isArray(response) ? response : [];
            setCardsList(data);
        } catch (err) {
            console.error("Lỗi tải flashcard:", err);
            setError("Không thể tải flashcard");
            setCardsList([]);
        } finally {
            setIsLoading(false);
        }
    }, [study_activity_id]);

    /**
     * Thêm flashcard mới
     */
    const createNewFlashcard = useCallback(async (flashcardId, front, back) => {
        const frontText = typeof front === 'string' ? front : front?.content || '';
        const backText = typeof back === 'string' ? back : back?.content || '';

        if (!frontText.trim() || !backText.trim() || !study_activity_id ) {
            setError('Vui lòng nhập nội dung');
            return null;
        }

        setIsLoading(true);
        setError('');
        try {
            const newFlashcards = {
                front: frontText,
                back: backText,
            };
            
            const response = await addCard(flashcardId, newFlashcards);
            await loadFlashcards();
            return response;
            
        } catch (err) {
            console.error("Lỗi tạo flashcard:", err);
            setError("Lỗi tạo flashcard. Vui lòng thử lại");
            return null
        } finally {
            setIsLoading(false);
        }
    }, [study_activity_id, loadFlashcards]);

    /**
     * Chỉnh sửa flashcard
     */
    const updateCard = useCallback(async (flashcardId, front, back) => {
        const frontText = typeof front === 'string' ? front : front?.content || '';
        const backText = typeof back === 'string' ? back : back?.content || '';

        if (!frontText.trim() || !backText.trim() || !study_activity_id ) {
            setError('Bé vui lòng nhập nội dung nhé');
            return null;
        }

        setIsLoading(true);
        setError('');
        try {
            const newFlashcards = {
                front: frontText,
                back: backText,
            };
            
            const response = await updateFlashcard(flashcardId, newFlashcards);
            await loadFlashcards();
            return response;
            
        } catch (err) {
            console.error("Lỗi cập nhật flashcard:", err);
            setError("Lỗi cập nhật flashcard. Vui lòng thử lại");
            return null
        } finally {
            setIsLoading(false);
        }
    }, [study_activity_id, loadFlashcards]);
    /**
     * Xóa flashcard
     */
    const deleteFlashcard = useCallback(async (flashcardId) => {
        try {
            const response = await deleteCard(flashcardId);
            await loadFlashcards();
            return response
        } catch (err) {
            console.error("Lỗi xóa flashcard:", err);
            setError("Lỗi xóa flashcard");
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Tự động tải flashcards khi interactionId thay đổi
     */
    useEffect(() => {
        if (study_activity_id) {
            const timeoutId = setTimeout(() => {
                loadFlashcards();
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [study_activity_id, loadFlashcards]);

    return {
        cardsList, 
        setCardsList, // Để component có thể update nếu cần
        isLoading,
        error,
        loadFlashcards,
        createNewFlashcard,
        updateCard,
        deleteFlashcard,
    };
};

export default useFlashcardManagement;
