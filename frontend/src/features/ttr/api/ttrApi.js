const API_BASE_URL = 'http://localhost:8000/study-activity'; 
const getToken = () => localStorage.getItem('token'); 

// Hàm dùng chung để xử lý lỗi từ response
const handleApiError = async (response) => {
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: "Không thể kết nối đến máy chủ." };
    }
    
    // Ném ra object lỗi chuẩn xác theo tài liệu Backend
    throw {
      status_code: response.status,
      exception_type: errorData.exception_type || 'UNKNOWN_ERROR',
      message: errorData.message || 'Đã xảy ra lỗi không xác định.'
    };
  }
};

export const fetchActivitiesByInteraction = async (interactionId) => {
  const response = await fetch(`${API_BASE_URL}/${interactionId}/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (response.status === 404) return []; // Nếu không tìm thấy trả về mảng rỗng
  await handleApiError(response);
  return await response.json();
};

export const fetchStudyActivity = async (studyActivityId) => {
  const response = await fetch(`${API_BASE_URL}/${studyActivityId}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  await handleApiError(response);
  return await response.json();
};

export const createTTRActivity = async (interactionId, payload) => {
  // Quét cả 2 kiểu viết biến, nếu không có mới chịu thua về MATHS
  const finalSubject = payload.subject_type || payload.subjectType || "MATHS";

  const response = await fetch(`${API_BASE_URL}/${interactionId}/create`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${getToken()}` 
    },
    body: JSON.stringify({
      prompt: payload.prompt,
      activity_type: "REVIEW", 
      activity_format: "GAP_FILL",
      subject_type: finalSubject // Ép thẳng môn học vào đây
    })
  });
  
  await handleApiError(response);
  return await response.json();
};