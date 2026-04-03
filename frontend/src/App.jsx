import { useState, useEffect } from 'react';
import axios from 'axios';

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
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${MY_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

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





  // Xử lý khi gửi câu hỏi
  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);

    try {
      // Axios tự động stringify body thành JSON
      const response = await api.post(`/llm-response/${interactionId}/chat`, {
        content: query
      });

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.content || response.data.response 
      };
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (error) {
      // Axios tự động bắt lỗi 4xx, 5xx vào catch
      const errMsg = error.response?.data?.message || "Lỗi kết nối";
      alert("Lỗi: " + errMsg);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  // Xử lý khi chọn file từ máy tính
  const handleFileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    // Cập nhật danh sách file tạm thời cộng dồn
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  // Xóa một file cụ thể khỏi danh sách tạm thời
  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // Gửi file qua backend
  const uploadFiles = async () => {
    if (files.length === 0) return alert("Vui lòng chọn file!");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      // Khi gửi FormData, Axios sẽ tự động xóa Content-Type JSON và set multipart/form-data
      const response = await api.post(`/document/${interactionId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Đã upload file thành công!");
      setFiles([]);
      // Cập nhật lại danh sách file đã có trên server
      setUploadedFiles(prev => [...prev, ...response.data]); 
      
    } catch (error) {
      alert("Upload thất bại: " + (error.response?.data?.message || "Lỗi server"));
    }
  };       


  
  return (
    <div>
      <h1>Upload your files</h1>
      
      {/* Input chọn file */}
      <input 
        type="file" 
        multiple 
        onChange={handleFileInputChange} 
        
      />

      {/* Danh sách file hiển thị tạm thời */}
      <div style={{ marginTop: '20px' }}>
        <h3>Danh sách file đã chọn ({files.length}):</h3>
        {files.length === 0 ? (
          <p>Chưa có file nào được chọn.</p>
        ) : (
          <ul>
            {files.map((file, index) => (
              <li 
                key={index} 
                
              >
                <span>
                  <strong>{file.name}</strong> 
                  <small >
                    ({(file.size / 1024).toFixed(2)} KB)
                  </small>
                </span>
                <button onClick={() => removeFile(index)}>
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3>Tài liệu hiện có trên server:</h3>
        <ul>
            {uploadedFiles.map(doc => <li key={doc.id}>{doc.file_name} (ID: {doc.id})</li>)}
        </ul>
      </div>  

      {/* Nút upload */}
      {files.length > 0 && (
        <button 
          onClick={uploadFiles}
        >
          Tải file lên server
        </button>
      )}

      <hr />

      {/* --- PHẦN CHAT QUERY --- */}
      <h2>Hỏi đáp về tài liệu</h2>
      
      {/* Khung hiển thị nội dung chat */}
      <div>
        {chatHistory.length === 0 && <p>Chưa có câu hỏi nào. Hãy nhập gì đó!</p>}
        {chatHistory.map((msg, index) => (
          <div key={index} >
            <div>
              <strong>{msg.role === 'user' ? 'Bạn: ' : 'AI: '}</strong>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <p><i>AI đang suy nghĩ...</i></p>}
      </div>

      {/* Ô nhập liệu */}
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nhập câu hỏi tại đây..."
        onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
      />
      <button onClick={handleQuery} disabled={isLoading}>
        Gửi
      </button>

    </div>
  );
}

export default App