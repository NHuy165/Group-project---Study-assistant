import { useState } from 'react';

export const useLearningPath = () => {
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [pathData, setPathData] = useState(null);

  const generateLearningPath = async (documentId, documentName) => {
    setIsGeneratingPath(true);
    setPathData(null); 
    
    try {
      // TƯƠNG LAI: Gọi API thật truyền documentId xuống BE
      // const response = await api.generateLearningPath(documentId);
      
      // HIỆN TẠI: Giả lập chờ 3 giây
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockMarkdownResponse = `
### Lộ trình học cho tài liệu: **${documentName}** 🚀

Dựa vào nội dung tài liệu bé vừa chọn, Cú Mèo gợi ý lộ trình sau:

#### **Ngày 1: Khám phá kiến thức**
* Đọc lướt qua các khái niệm chính trong 3 trang đầu.
* Đánh dấu lại những từ khóa hoặc công thức bé chưa hiểu rõ.

#### **Ngày 2: Thực hành & Vận dụng**
* Trả lời các câu hỏi / bài tập ở cuối tài liệu.
* Nhờ Cú Mèo (ở khung chat) giải thích những phần còn vướng mắc.

#### **Ngày 3: Ôn tập & Mở rộng**
* Tạo một bản đồ tư duy (Mindmap) tóm tắt lại toàn bộ tài liệu.
* Làm một bài Quiz nhanh để kiểm tra trí nhớ.

*Cú Mèo tin bé sẽ chinh phục tài liệu này rất dễ dàng! ❤️*
      `;
      setPathData(mockMarkdownResponse);

    } catch (error) {
      console.error("Lỗi tạo lộ trình:", error);
      setPathData("❌ Rất tiếc, Cú Mèo đang gặp sự cố khi đọc tài liệu này. Bé thử lại sau nhé!");
    } finally {
      setIsGeneratingPath(false);
    }
  };

  return { isGeneratingPath, pathData, generateLearningPath };
};