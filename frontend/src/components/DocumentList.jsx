function DocumentList({ files }) {

    // Xóa một file cụ thể khỏi danh sách tạm thời
    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            {/* Danh sách file hiển thị tạm thời */}
            <div>
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
        </>
    )
}

export default DocumentList;