import { useState, useCallback, useEffect } from 'react';
import { readFlashcard, addCard, updateFlashcard } from '../api/flashcardAPI';

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
     * Tạo flashcard mới từ prompt
     */
    const createNewFlashcard = useCallback(async (front, back) => {
        const frontText = typeof front === 'string' ? front : front?.content || '';
        const backText = typeof back === 'string' ? back : back?.content || '';

        if (!frontText.trim() || !backText.trim() || !study_activity_id ) {
            setError('Vui lòng nhập nội dung');
            return null;
        }

        setIsLoading(true);
        setError('');
        try {

            const firstCard = cardsList[0];

            const nextId = cardsList.length > 0
                ? Math.max (...cardsList.map(card => Number(card.id) || 0)) + 1
                : 1;

            // createFlashcard trả về array of { id, front, back, ... }
            const newFlashcards = {
                id: nextId,
                studyActivityId: study_activity_id,
                name: firstCard?.name || '',
                description: firstCard?.description || '',
                front: frontText,
                back: backText,
            };
            
            setCardsList(prev => [...prev, newFlashcards]);
            return newFlashcards;
            
        } catch (err) {
            console.error("Lỗi tạo flashcard:", err);
            setError("Lỗi tạo flashcard. Vui lòng thử lại");
            return null
        } finally {
            setIsLoading(false);
        }
        return null;
    }, [study_activity_id, cardsList]);

    /**
     * Xóa flashcard
     */
    const removeFlashcard = useCallback(async (flashcardId) => {
        try {
            // Xóa từ local state
            setCardsList(prev => prev.filter(card => card.id !== flashcardId));
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
        if (study_activity_id) {
            loadFlashcards();
        }
    }, [study_activity_id, loadFlashcards]);

    return {
        cardsList, 
        setCardsList, // Để component có thể update nếu cần
        isLoading,
        error,
        loadFlashcards,
        createNewFlashcard,
        removeFlashcard,
    };
};

export default useFlashcardManagement;
