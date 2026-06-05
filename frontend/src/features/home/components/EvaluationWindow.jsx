import React from 'react';

/**
 * Presentational component that shows the evaluation window.
 * Props:
 * - data: API response (string or object)
 * - loading: boolean loading state
 * - error: error object
 * - isOpen: whether the window is currently visible (controls close button visibility)
 * - onClose: callback to close the window
 */
const EvaluationWindow = ({ data, loading, error, isOpen = true, onClose = () => {} }) => {
  return (
    <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-blue-100 p-4 text-white font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-100 rounded-full animate-pulse" />
          <span>AI đánh giá kết quả học tập</span>
        </div>

        {isOpen && (
          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 w-10 shrink-0 items-center justify-center text-gray-400 transition-all hover:rotate-90 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Đóng cửa sổ đánh giá"
            title="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
        {loading ? (
          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm w-fit max-w-[85%]">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-6 px-4 text-sm">
            Có lỗi khi tải đánh giá: {error?.message || 'Vui lòng thử lại sau.'}
          </div>
        ) : data ? (
          <div className="flex flex-col items-start">
            <div className="bg-blue-50 text-blue-900 p-3 rounded-xl rounded-tl-none max-w-[85%] shadow-sm whitespace-pre-line text-sm">
              {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-12 px-4">
            Nhấn vào nút bên dưới để AI phân tích tiến độ học tập của em nhé!
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationWindow;