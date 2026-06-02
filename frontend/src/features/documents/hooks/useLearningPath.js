import { useState } from 'react';

export const useLearningPath = (interactionId) => {
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [pathData, setPathData] = useState(null);

  const openPathModal = () => setIsPathModalOpen(true);
  const closePathModal = () => setIsPathModalOpen(false);

  const generateLearningPath = async () => {
    setIsGeneratingPath(true);
    setPathData(null); 
    
    try {
      // TƯƠNG LAI: Gọi API thật từ Backend
      // const response = await api.generateLearningPath(interactionId);
      // setPathData(response.content);
      
      // HIỆN TẠI: Giả lập chờ 3.5 giây rồi hiện text
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const mockMarkdownResponse = `
### Lộ trình ôn tập 3 ngày tới 🚀

Dựa vào các tài liệu Toán và Tiếng Việt bé vừa tải lên, Cú Mèo gợi ý lộ trình sau:

#### **Ngày 1: Ôn tập cơ bản**
* **Toán:** Làm 10 câu trắc nghiệm đầu tiên trong đề thi.
* **Tiếng Việt:** Đọc hiểu phần văn bản trích dẫn.

#### **Ngày 2: Luyện giải bài tập**
* **Toán:** Tập trung giải 5 bài toán đố về phân số.
* **Tiếng Việt:** Luyện viết một đoạn văn ngắn 5-7 câu.

#### **Lưu ý nhỏ:**
Bé hãy chia nhỏ thời gian học, học 25 phút thì nghỉ 5 phút để não bộ thư giãn nhé! Cú Mèo tin bé sẽ làm rất tốt! ❤️
      `;
      setPathData(mockMarkdownResponse);

    } catch (error) {
      console.error("Lỗi tạo lộ trình:", error);
      setPathData("❌ Rất tiếc, Cú Mèo đang gặp sự cố khi đọc tài liệu. Bé thử lại sau nhé!");
    } finally {
      setIsGeneratingPath(false);
    }
  };

  return {
    isPathModalOpen,
    openPathModal,
    closePathModal,
    isGeneratingPath,
    pathData,
    generateLearningPath
  };
};