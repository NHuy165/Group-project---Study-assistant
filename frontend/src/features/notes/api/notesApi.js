// createNote, readNotes, updateNote, deleteNote

import axios from 'axios';

const API_URL = 'http://localhost:8000/note';

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// POST: parameter: interactionId, body: noteData
export const createNote = async (interactionId, noteData) => {
    const response = await axios.post(`${API_URL}/${interactionId}/upload`, noteData, getAuthHeader());
    return response.data;
};

// GET: parameter: interactionId
export const readNotes = async (interactionId) => {
    const response = await axios.get(`${API_URL}/${interactionId}/`, getAuthHeader());
    return response.data;
};

// PATCH: parameter: noteId, body: updateData
export const updateNote = async (noteId, updateData) => {
    const response = await axios.patch(`${API_URL}/${noteId}`, updateData, getAuthHeader());
    return response.data;
};

// DELETE: parameter: noteId
export const deleteNote = async (noteId) => {
    const response = await axios.delete(`${API_URL}/${noteId}`, getAuthHeader());
    return response.data;
};