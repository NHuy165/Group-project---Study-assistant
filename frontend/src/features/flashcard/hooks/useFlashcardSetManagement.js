import { useState, useCallback, useEffect } from 'react';
import { readAllFlashcards, createFlashcard, deleteFlashcard, createEmptyFlashcard } from '../api/flashcardAPI';

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
    const [isCreatingWithAI, setIsCreatingWithAI] = useState(false);

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
    const createNewFlashcardSet = useCallback(async (promptData) => {
        const promptText = typeof promptData === 'object' ? promptData.prompt : promptData;

        if (!promptText?.trim() || !interactionId) {
            setError('Bé vui lòng nhập nội dung nhé');
            return null;
        }

        setIsCreatingWithAI(true);
        setError('');
        try {
            // createFlashcard trả về array of { id, front, back, ... }
            const newFlashcardSet = await createFlashcard(interactionId, promptData);

            if (newFlashcardSet) {
                setFlashcardSets(prev => [newFlashcardSet, ...prev]); 
            }
            // loadFlashcardSets();

            setPrompt('');
            return newFlashcardSet;

        } catch (err) {
            console.error("Lỗi tạo flashcard:", err);
            setError("Lỗi tạo flashcard. Vui lòng thử lại");
        } finally {
            setIsCreatingWithAI(false);
        }
        return null;
    }, [interactionId]);//, loadFlashcardSets]);

    /**
     * Tạo bộ flashcard trống
     */
    const createEmptyFlashcardSet = useCallback(async (formData) => {
        const subjectType = formData?.subject_type || '';
        const setName = formData?.name || '';
        const setDescription = formData?.description || '';

        if (
            !subjectType.trim() ||
            !setName.trim() ||
            !setDescription.trim() ||
            !interactionId
        ) {
            setError('Bé vui lòng nhập nội dung nhé');
            return null;
        }

        setIsLoading(true);
        setError('');
        try {

            const newFlashcardSet = await createEmptyFlashcard(interactionId, {
                subject_type: subjectType,
                name: setName,
                description: setDescription,
            }
            );

            if (newFlashcardSet) {
                setFlashcardSets(prev => [newFlashcardSet, ...prev]); 
            }
            // await loadFlashcardSets();

            setPrompt('');
            return newFlashcardSet;

        } catch (err) {
            console.error("Lỗi tạo flashcard:", err);
            setError("Lỗi tạo flashcard. Vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
        return null;
    }, [interactionId]);//, loadFlashcardSets]);

    /**
     * Xóa bộ flashcard
     */
    const removeFlashcardSet = useCallback(async (study_activity_id) => {
        setIsLoading(true);
        setError('');
        try {
            // Gọi API xóa trước
            await deleteFlashcard(study_activity_id);
            // Xóa từ local state
            setFlashcardSets(prev => prev.filter(set => set.id !== study_activity_id))
            setError('');
        } catch (err) {
            console.error("Lỗi xóa flashcard:", err);
            setError("Lỗi xóa bộ flashcard. Vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Tự động tải flashcards khi interactionId thay đổi
     */
    useEffect(() => {
        if (interactionId) {
            const timeoutId = setTimeout(() => {
                loadFlashcardSets();
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [interactionId, loadFlashcardSets]);

    return {
        flashcardSets, 
        setFlashcardSets, // Để component có thể update nếu cần
        isLoading,
        isCreatingWithAI,
        error,
        prompt, 
        setPrompt,
        loadFlashcardSets,
        createNewFlashcardSet,
        createEmptyFlashcardSet,
        removeFlashcardSet,
    };
};

export default useFlashcardSetManagement;
