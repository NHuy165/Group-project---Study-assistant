import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/notesApi';

export const useNotes = (interactionId) => {
    //

    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const readNotes = async () => {
        setIsLoading(true);
        try {
            // Truyền interactionId vào để lấy đúng các note của tương tác đó
            const data = await api.readNotes(interactionId);
            setNotes(data);
        } catch (err) {
            setError("Lỗi khi lấy danh sách ghi chú");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Hàm này chạy tại đây để tự động lấy NOTES của Interaction hiện tại
        if (interactionId) {
            readNotes();
        }
    }, [interactionId]); // Khi nào interactionId thay đổi thì lấy lại Note mới

    const saveNote = async (noteInput) => {
        try {
            const newNote = await api.createNote(interactionId, noteInput);
            setNotes(prev => [...prev, newNote]);
            return newNote;
        } catch (err) {
            setError("Lỗi khi lưu ghi chú");
        }
    };

    const updateNote = async (noteId, updateData) => {
        try {
            const updatedNote = await api.updateNote(noteId, updateData);
            setNotes(prev => prev.map(note => note.id === noteId ? updatedNote : note));
            return updatedNote;
        } catch (err) {
            setError("Lỗi khi cập nhật ghi chú");
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await api.deleteNote(noteId);
            setNotes(prev => prev.filter(n => n.id !== noteId));
        } catch (err) {
            setError("Lỗi khi xóa ghi chú");
        }
    };

    return {
        notes,
        isLoading,
        error,
        createNote: saveNote,
        updateNote,
        deleteNote
    };
};