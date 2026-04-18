import { useState, useEffect, use } from 'react';
import * as api from '../api/interactionsAPI';

export const useInteractions = () => {
    const [interactions, setInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [interactionName, setInteractionName] = useState('Tên cuộc trò chuyện');
    const [interactionDescription, setInteractionDescription] = useState('Mô tả nội dung cuộc trò chuyện');

    const [editingInteractionID, setEditingInteractionID] = useState(null);

    // Hiển thị tên interaction khi người dùng nhập: Gọi 2 lần: khi create và khi update
    const handleInteractionNameChange = (e) => {
        setInteractionName(e.target.value);
    }

    // Hiển thị mô tả interaction khi người dùng nhập: Gọi 2 lần: khi create và khi update
    const handleInteractionDescriptionChange = (e) => {
        setInteractionDescription(e.target.value);
    }

    // Xử lý sự kiện khi người dùng ấn "New chat"
    const handleNewChatClick = async(e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Gom dữ liệu từ State của UI thành documentInput
        const interactionInput = {
            name: interactionName || "Cuộc trò chuyện", 
            description: interactionDescription || "...",
        };
        await createInteraction(interactionInput);
        
        // Reset form sau khi thành công
        setInteractionName('');
        setInteractionDescription('');
    };

    // Xử lý sự kiện khi người dùng ấn Edit ở mỗi interaction
    const handleEditInteractionClick = (interactionEditing) => {
        setEditingInteractionID(interactionEditing.id);
        setInteractionName(interactionEditing.name);
        setInteractionDescription(interactionEditing.description);
    };

    // Hủy hành động edit
    const cancelEditInteractionClick = () => {
        setEditingInteractionID(null);
        setInteractionName('Tên cuộc trò chuyện');
        setInteractionDescription('Mô tả nội dung cuộc trò chuyện');
    }

    // Gọi khi người dùng ấn update (sau khi đã thực hiện edit, ấn update để lưu thay đổi => gọi hàm này)
    const handleUpdateInteractionClick = async(e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!editingInteractionID) return;

        const updateData = {
            name: interactionName || "Cuộc trò chuyện",
            description: interactionDescription || "...",
        };

        await updateInteraction(editingInteractionID, updateData);
        cancelEdit(); // Sửa xong thì xóa dấu vết, reset form
    }

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
        interactionName,
        interactionDescription,

        handleInteractionNameChange,
        handleInteractionDescriptionChange,
        handleNewChatClick, // createInteraction
        handleEditInteractionClick,
        cancelEditInteractionClick,
        handleUpdateInteractionClick, // updateInteraction
        readInteractions,
        deleteInteraction
    };
};