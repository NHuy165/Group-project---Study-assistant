import React, { useState, useEffect } from 'react';

const EvaluationWindow = ({ 
  data, 
  loading, 
  error, 
  isOpen = true, 
  onClose = () => {},
  // Các prop mới phục vụ cho tính năng xem lịch sử
  history = [],
  totalHistory = 0,
  onFetchHistory = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('today'); // 'today' hoặc 'history'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // Lắng nghe sự kiện chuyển tab lịch sử hoặc đổi trang để kéo dữ liệu mới
  useEffect(() => {
    if (activeTab === 'history' && !selectedHistoryItem) {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      onFetchHistory(ITEMS_PER_PAGE, offset);
    }
  }, [activeTab, currentPage, selectedHistoryItem]);

  const totalPages = Math.ceil(totalHistory / ITEMS_PER_PAGE) || 1;

  return (
    <div className="w-85 h-112 w-[360px] h-[480px] bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white font-semibold flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Cố vấn Học tập AI</span>
        </div>

        {isOpen && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:rotate-90"
            aria-label="Đóng cửa sổ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-medium">
        <button
          className={`flex-1 py-2.5 text-center transition-colors ${activeTab === 'today' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setActiveTab('today'); setSelectedHistoryItem(null); }}
        >
          Đánh giá hôm nay
        </button>
        <button
          className={`flex-1 py-2.5 text-center transition-colors ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('history')}
        >
          Lịch sử ({totalHistory})
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col justify-between">
        
        {/* LOADING LOADER */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex space-x-1.5 p-3 bg-white rounded-xl shadow-sm">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 my-auto px-4 text-sm font-medium">
            ⚠️ Có lỗi xảy ra: {error?.message || 'Vui lòng thử lại sau.'}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-2">
            
            {/* TAB 1: TODAY ASSESSMENT */}
            {activeTab === 'today' && (
              <div className="h-full flex flex-col justify-center">
                {data && data.trim() !== "" ? (
                  /* Nếu có dữ liệu đánh giá, hiển thị nội dung */
                  <div className="bg-white text-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 whitespace-pre-line text-sm leading-relaxed mb-auto">
                    {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
                  </div>
                ) : (
                  /* Nếu người dùng mới tạo acc, hoặc hệ thống trả về null/rỗng */
                  <div className="text-center px-4 py-8 flex flex-col items-center justify-center space-y-3 my-auto">
                    {/* Bạn có thể thêm icon hoặc emoji cho sinh động */}
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl">
                      ✨
                    </div>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[85%]">
                      Chưa có đánh giá nào. Bé bắt đầu bài học để nhận đánh giá vào hôm sau nhé.
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* TAB 2: HISTORY LIST OR DETAIL */}
            {activeTab === 'history' && (
              <div className="h-full flex flex-col">
                {selectedHistoryItem ? (
                  /* Giao diện xem Chi tiết một item trong lịch sử */
                  <div className="flex flex-col h-full animate-fade-in">
                    <button 
                      onClick={() => setSelectedHistoryItem(null)}
                      className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 hover:underline"
                    >
                      ← Quay lại danh sách
                    </button>
                    <div className="bg-blue-50 text-xs font-semibold text-blue-700 px-3 py-1.5 rounded-md mb-2 w-fit">
                      Ngày đánh giá: {selectedHistoryItem.createdAt ? new Date(selectedHistoryItem.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                    <div className="bg-white text-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 whitespace-pre-line text-sm overflow-y-auto max-h-[250px] leading-relaxed">
                      {selectedHistoryItem.content || JSON.stringify(selectedHistoryItem, null, 2)}
                    </div>
                  </div>
                ) : (
                  /* Giao diện list danh sách 10 dòng */
                  <div className="space-y-2">
                    {history.length > 0 ? (
                      history.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          onClick={() => setSelectedHistoryItem(item)}
                          className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all flex justify-between items-center"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-xs text-gray-700">
                              📑 Nhật ký đánh giá #{((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Không rõ ngày'}
                            </span>
                          </div>
                          <span className="text-blue-500 text-xs">Xem →</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 mt-16 text-xs">Chưa có lịch sử đánh giá nào.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* BOTTOM PAGINATION CONTROLS (Chỉ hiển thị ở tab history và khi không chọn xem chi tiết) */}
        {activeTab === 'history' && !selectedHistoryItem && !loading && !error && totalPages > 1 && (
          <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-1 bg-gray-50 text-xs">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="px-2.5 py-1.5 rounded bg-white border border-gray-200 shadow-2xs font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="text-gray-500 font-medium text-[11px]">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="px-2.5 py-1.5 rounded bg-white border border-gray-200 shadow-2xs font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationWindow;