import { useState, useEffect, use } from 'react';
import * as api from '../api/interactionsAPI';

export const useInteractions = () => {
    const [interactions, setInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const readInteractions = async () => {
        // Hàm này được chạy tại đây bằng useEffect để lấy interactions
        setIsLoading(true);
        try {
            const data = await api.readInteractions();
            setInteractions(data);
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể tải danh sách tương tác");
            console.error("Error fetching interactions:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        readInteractions();
    }, []);

    const createInteraction = async (input) => {
        setIsLoading(true);
        try {
            const newInteraction = await api.createInteraction(input);
            setInteractions([...interactions, newInteraction]); // Cập nhật danh sách tại chỗ
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi khi tạo mới");
            console.error("Error creating interaction:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateInteraction = async (id, updateData) => {
        setIsLoading(true);
        try {
            const updated = await api.updateInteraction(id, updateData);
            setInteractions(interactions.map(item => item.id === id ? updated : item));
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi khi cập nhật");
            console.error("Error updating interaction:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteInteraction = async (id) => {
        setIsLoading(true);
        try {
            await api.deleteInteraction(id);
            setInteractions(interactions.filter(item => item.id !== id));
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi khi xóa");
            console.error("Error deleting interaction:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        interactions,
        isLoading,
        error,
        readInteractions,
        createInteraction,
        updateInteraction,
        deleteInteraction
    };
};