function FileUpload({ setFiles }) {
    // Xử lý khi chọn file từ máy tính
    const handleFileInputChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        // Cập nhật danh sách file tạm thời cộng dồn
        setFiles(prev => [...prev, ...selectedFiles]);
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
    </div>
  );
}

export default FileUpload;