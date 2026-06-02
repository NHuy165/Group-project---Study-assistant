import { useState, useEffect } from 'react';
import { getStudentAssessment } from '../api/studyProgressAPI';

export const useEvaluation = (autoFetch = false) => {
    const [assessment, setAssessment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAssessment = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getStudentAssessment();
            // Normalize to a string (UI expects a text blob)
            const text = data == null ? '' : (typeof data === 'string' ? data : JSON.stringify(data));
            setAssessment(text);
            return text;
        } catch (err) {
            console.error('Lỗi khi load đánh giá học sinh:', err);
            setError(err);
            setAssessment(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchAssessment();
        }
    }, [autoFetch]);

    return { assessment, isLoading, error, fetchAssessment };
};