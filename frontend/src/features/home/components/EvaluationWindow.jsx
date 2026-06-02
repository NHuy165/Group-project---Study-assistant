import React from 'react';

const EvaluationWindow = ({ data, loading, error }) => {
  return (
    <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Trợ lý Học tập AI</span>
        </div>
      </div>

      {/* Nội dung Evaluation */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
        {loading ? (
          /* Trạng thái Loading đang quét dữ liệu */
          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm w-fit max-w-[85%]">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-6 px-4 text-sm">
            Có lỗi khi tải đánh giá: {error?.message || 'Vui lòng thử lại sau.'}
          </div>
        ) : data ? (
          /* Trạng thái hiển thị dữ liệu từ API: raw text */
          <div className="flex flex-col items-start">
            <div className="bg-blue-50 text-blue-900 p-3 rounded-xl rounded-tl-none max-w-[85%] shadow-sm whitespace-pre-line text-sm">
              {typeof data === 'string' ? data : JSON.stringify(data)}
            </div>
          </div>
        ) : (
          /* Trạng thái ban đầu khi chưa bấm kích hoạt */
          <div className="text-center text-gray-400 mt-12 px-4">
            Nhấn vào nút bên dưới để AI phân tích tiến độ học tập của em nhé!
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationWindow;