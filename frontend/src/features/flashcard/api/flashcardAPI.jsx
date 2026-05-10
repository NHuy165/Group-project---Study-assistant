import axiosClient from '../../../api/axiosClient';

const PATH = '/study-activity';

const FRONT_TYPE = 'FLASHCARDS_FRONT';
const BACK_TYPE = 'FLASHCARDS_BACK';

export const transformBackendFlashcards = (studyActivityComplete) => {
    if (!studyActivityComplete || !Array.isArray(studyActivityComplete.items)) {
        return [];
    }

    return studyActivityComplete.items.map((reviewItem) => {
        const contents = Array.isArray(reviewItem.contents) ? reviewItem.contents : [];
        const frontContent = contents.find((content) => content.type === FRONT_TYPE);
        const backContent = contents.find((content) => content.type === BACK_TYPE);

        return {
            id: reviewItem.id,
            studyActivityId: studyActivityComplete.id,
            name: studyActivityComplete.name,
            description: studyActivityComplete.description,
            front: frontContent?.content || '',
            back: backContent?.content || '',
        };
    });
};

export const createFlashcard = async (interactionId, promptData) => {
    const promptText = typeof promptData === 'object' ? promptData.prompt : promptData;

    const payload = {
        prompt: promptText,
        activity_type: "REVIEW",
        activity_format: "FLASHCARDS",
        subject_type: 'ENGLISH',
    };

    // const response = await axiosClient.post(`${PATH}/${interactionId}/create`, payload);
    const response = await axiosClient.post(
            "http://localhost:8000/study-activity/1/create",
            payload
        )
    return transformBackendFlashcards(response.data);
};

export const readFlashcard = async (id) => {
    try {
        const response = await axiosClient.get(`${PATH}/${id}`);
        return transformBackendFlashcards(response.data);
    } catch (error) {
        console.error("Error reading flashcard:", error);
        return []; 
    }
};

export const readAllFlashcards = async (interactionId) => {
    try {
        const response = await axiosClient.get(`${PATH}/${interactionId}/`);
        const activities = Array.isArray(response.data) ? response.data : [];
        
        // Filter chỉ lấy flashcards format
        const flashcardActivities = activities.filter((activity) => (
            activity.activity_type === "REVIEW" &&
            activity.activity_format === "FLASHCARDS"
        ));

        // Lấy chi tiết từng activity
        const completeActivities = await Promise.all(
            flashcardActivities.map((activity) => readFlashcard(activity.id)),
        );

        return completeActivities.flat();
    } catch (error) {
        console.warn('Error reading all flashcards:', error);
        return [];
    }
};

export const deleteFlashcard = async (flashcardId) => {
    try {
        const response = await axiosClient.delete(`${PATH}/${flashcardId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        throw error;
    }
};

