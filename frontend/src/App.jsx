import { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import ChatBox from './components/ChatBox';

function App() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 1. Lấy cấu hình từ .env
  const interactionId = import.meta.env.VITE_INTERACTION_ID;
  const MY_TOKEN = import.meta.env.VITE_MY_TOKEN;
  const BASE_URL = import.meta.env.VITE_API_URL;

  // 2. Tạo một Axios Instance để dùng chung headers và baseUrl

  //3. HÀM LẤY DỮ LIỆU TỪ SERVER
  const fetchInitialData = async () => {
    try {
      // Axios tự động chuyển JSON, ta chỉ việc lấy data từ response
      const [chatRes, docRes] = await Promise.all([
        api.get(`/llm-response/${interactionId}/`),
        api.get(`/document/${interactionId}/`)
      ]);

      // Xử lý lịch sử chat
      setChatHistory(chatRes.data.map(item => ({
        role: item.is_user ? 'user' : 'assistant',
        content: item.content
      })));

      // Xử lý file đã upload
      setUploadedFiles(docRes.data);

    } catch (error) {
      console.error("Không thể lấy dữ liệu cũ:", error);
    }
  };

  // 4. TỰ ĐỘNG CHẠY KHI LOAD TRANG
  useEffect(() => {
      fetchInitialData();
  }, []); // Chạy 1 lần duy nhất


  
  return (
    <div>
      <FileUpload setFiles={setFiles} />
      <DocumentList files={files} setFiles={setFiles} />
      <ChatBox 
        chatHistory={chatHistory} 
        setChatHistory={setChatHistory} 
        query={query} 
        setQuery={setQuery} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default App