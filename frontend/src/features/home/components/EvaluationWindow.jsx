import React, { useState } from 'react';

// Hàm helper để parse Markdown thô từ AI thành các thẻ HTML
const FormatMarkdown = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, index) => {
    let cleanLine = line.trim();
    if (cleanLine.startsWith('###') || cleanLine.startsWith('##')) {
      const headingText = cleanLine.replace(/^#+\s*/, '');
      return <h4 key={index} className="font-bold text-blue-800 text-sm mt-3 mb-1">{headingText}</h4>;
    }
    if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
      const bulletText = cleanLine.substring(1).trim();
      return (
        <li key={index} className="list-disc ml-4 text-xs text-gray-600 my-0.5 leading-relaxed">
          {renderBoldText(bulletText)}
        </li>
      );
    }
    return <p key={index} className="text-xs text-gray-600 my-1 leading-relaxed">{renderBoldText(cleanLine)}</p>;
  });
};

const renderBoldText = (rawText) => {
  const parts = rawText.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part);
};

const EvaluationWindow = ({ 
  data, 
  loading, 
  error, 
  isOpen = true, 
  onClose = () => {},
  historyList = [],
  totalHistory = 0,
  onFetchHistory = () => {},
  detailAssessment = null,
  onFetchDetail = () => {},
  onResetDetail = () => {},
  isDetailLoading = false,
  detailError = null
}) => {
  const [activeTab, setActiveTab] = useState('today'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDateLabel, setSelectedDateLabel] = useState('');
  const [customDate, setCustomDate] = useState(''); 
  const ITEMS_PER_PAGE = 10;

  // Tính toán tổng số trang dựa trên tổng số bản ghi từ Backend
  const totalPages = Math.ceil(totalHistory / ITEMS_PER_PAGE) || 1;

  // Xử lý gửi tra cứu ngày lên backend (dùng param specific_date chuẩn của bạn)
  const executeSearch = (dateVal) => {
    if (!dateVal) return;
    const [year, month, day] = dateVal.split('-');
    if (!year || !month || !day || year.length < 4) return;

    setSelectedDateLabel(`${day}/${month}/${year}`);
    onFetchDetail(dateVal);
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch(customDate);
    }
  };

  return (
    <div className="w-[360px] h-[500px] bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden text-gray-800 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white font-semibold flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Cố vấn Học tập AI</span>
        </div>
        {isOpen && (
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:rotate-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" /></svg>
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-medium flex-shrink-0">
        <button 
          className={`flex-1 py-2.5 text-center transition-colors ${activeTab === 'today' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-white' : 'text-gray-500 hover:text-gray-700'}`} 
          onClick={() => { setActiveTab('today'); onResetDetail(); }}
        >
          Đánh giá hôm nay
        </button>
        <button 
          className={`flex-1 py-2.5 text-center transition-colors ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600 font-bold bg-white' : 'text-gray-500 hover:text-gray-700'}`} 
          onClick={() => { 
            setActiveTab('history'); 
            onResetDetail(); 
            setCustomDate(''); 
            setCurrentPage(1); 
            onFetchHistory(ITEMS_PER_PAGE, 0); 
          }}
        >
          Lịch sử ({totalHistory})
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-3 bg-gray-50 flex flex-col justify-between overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex space-x-1.5 p-3 bg-white rounded-xl shadow-sm">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TAB 1: Hôm nay */}
            {activeTab === 'today' && (
              <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col">
                {data && data.trim() !== "" ? (
                  <div className="bg-white text-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 mb-auto">
                    <FormatMarkdown text={data} />
                  </div>
                ) : (
                  <div className="text-center px-4 py-8 flex flex-col items-center justify-center space-y-3 mt-16 my-auto">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl">✨</div>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-[85%]">Chưa có đánh giá nào. Bé bắt đầu bài học để nhận đánh giá vào hôm sau nhé.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Lịch sử */}
            {activeTab === 'history' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Ô TRA CỨU THEO NGÀY: Luôn ở trên cùng */}
                {(!detailAssessment && !detailError && !isDetailLoading) && (
                  <div className="mb-2 bg-white p-2 rounded-xl border border-gray-100 shadow-xs flex flex-col gap-1 flex-shrink-0">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-0.5">🔍 Tra cứu nhanh theo ngày</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="date" 
                        value={customDate}
                        onChange={handleCustomDateChange}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-blue-500 bg-gray-50/50"
                      />
                      <button
                        onClick={() => executeSearch(customDate)}
                        disabled={!customDate}
                        className="px-3 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all"
                      >
                        Tìm
                      </button>
                    </div>
                  </div>
                )}

                {error ? (
                  <div className="text-center text-red-500 my-auto px-4 text-xs font-medium py-16">
                    ⚠️ Không thể tải danh sách lịch sử.
                  </div>
                ) : (isDetailLoading || detailAssessment || detailError) ? (
                  
                  /* MÀN HÌNH CHI TIẾT */
                  <div className="flex-1 flex flex-col overflow-hidden justify-between animate-fade-in">
                    <div className="flex flex-col flex-shrink-0">
                      <button 
                        onClick={() => {
                          onResetDetail();
                          setCustomDate(''); 
                        }} 
                        className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-2 hover:underline w-fit"
                      >
                        ← Quay lại danh sách chính
                      </button>
                      <div className="bg-indigo-50 text-[10px] font-bold text-indigo-700 px-2 py-0.5 rounded mb-1 w-fit">
                        Ngày: {selectedDateLabel}
                      </div>
                    </div>

                    {isDetailLoading ? (
                      <div className="flex flex-col justify-center items-center flex-1 text-xs text-gray-400 gap-2 my-auto py-12">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Đang tra cứu đánh giá...
                      </div>
                    ) : detailError ? (
                      <div className="bg-white p-5 rounded-xl shadow-sm text-red-500 text-xs text-center font-medium my-auto border border-gray-100">
                        ⚠️ Không tìm thấy đánh giá chi tiết cho ngày này.
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-xl border border-gray-100 overflow-y-auto flex-1 text-gray-700">
                        <FormatMarkdown text={detailAssessment} />
                      </div>
                    )}
                  </div>

                ) : (
                  
                  /* MÀN HÌNH DANH SÁCH CHÍNH: MỞ ĐỒNG THỜI THANH TRƯỢT VÀ CHUYỂN TRANG */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 px-0.5 mb-1 flex-shrink-0">Chọn từ danh sách dưới đây:</p>
                    
                    {/* BẬT THANH TRƯỢT: max-h-[220px] giới hạn chiều cao và overflow-y-auto mở thanh cuộn dọc */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[225px] pr-1 scrollbar-thin">
                      {historyList.length > 0 ? (
                        historyList.map((item, idx) => {
                          const assessmentOfQuery = item.assessment_of || '';
                          let dateDisplay = 'Không rõ ngày';
                          if (assessmentOfQuery) {
                            const [year, month, day] = assessmentOfQuery.split('-');
                            if (year && month && day) dateDisplay = `${day}/${month}/${year}`;
                          }

                          return (
                            <div 
                              key={item.id || idx}
                              onClick={() => {
                                setSelectedDateLabel(dateDisplay);
                                onFetchDetail(assessmentOfQuery); 
                              }}
                              className="bg-white px-2.5 py-2 rounded-lg border border-gray-100 shadow-xs hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all flex justify-between items-center flex-shrink-0"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="font-semibold text-xs text-gray-700 flex-shrink-0">
                                  📑 Nhật ký #{((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}
                                </span>
                                <span className="text-[11px] text-gray-400 truncate">— {dateDisplay}</span>
                              </div>
                              <span className="text-blue-500 text-[11px] font-medium flex-shrink-0">Xem →</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-400 py-12 text-xs my-auto">Chưa có lịch sử đánh giá nào.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PHÂN TRANG (EvaluationWindow_5.jsx) */}
        {activeTab === 'history' && !detailAssessment && !detailError && !isDetailLoading && !loading && !error && totalPages > 1 && (
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 bg-gray-50 text-xs flex-shrink-0">
            <button 
              disabled={currentPage === 1} 
              onClick={() => { 
                const nextPage = Math.max(currentPage - 1, 1); 
                setCurrentPage(nextPage); 
                onFetchHistory(ITEMS_PER_PAGE, (nextPage - 1) * ITEMS_PER_PAGE); 
              }} 
              className="px-2 py-1 rounded bg-white border border-gray-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Trước
            </button>
            <span className="text-gray-500 font-medium text-[11px]">Trang {currentPage} / {totalPages}</span>
            <button 
              // CHẶN TRANG BÓNG MA: Nếu mảng hiện tại không đủ 10 phần tử, chắc chắn không còn trang kế tiếp để bấm
              disabled={currentPage === totalPages || historyList.length < ITEMS_PER_PAGE} 
              onClick={() => { 
                const nextPage = Math.min(currentPage + 1, totalPages); 
                setCurrentPage(nextPage); 
                onFetchHistory(ITEMS_PER_PAGE, (nextPage - 1) * ITEMS_PER_PAGE); 
              }} 
              className="px-2 py-1 rounded bg-white border border-gray-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 transition-colors"
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