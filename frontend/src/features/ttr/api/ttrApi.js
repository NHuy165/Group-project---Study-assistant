const API_BASE_URL = 'http://localhost:8000/study-activity'; 
const getToken = () => localStorage.getItem('token'); 

// Lấy danh sách tất cả bài tập của Interaction này
export const fetchActivitiesByInteraction = async (interactionId) => {
  const response = await fetch(`${API_BASE_URL}/${interactionId}/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!response.ok) return []; 
  return await response.json();
};

export const fetchStudyActivity = async (studyActivityId) => {
  const response = await fetch(`${API_BASE_URL}/${studyActivityId}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!response.ok) throw new Error("Lỗi tải bài tập");
  return await response.json();
};

export const createTTRActivity = async (interactionId, payload) => {
  const response = await fetch(`${API_BASE_URL}/${interactionId}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      prompt: payload.prompt,
      activity_type: "REVIEW", 
      activity_format: "GAP_FILL",
      subject_type: "VIETNAMESE"
    })
  });
  if (!response.ok) throw new Error("Không thể tạo bài tập");
  return await response.json();
};