// features/interactions/components/ToolSetupArea.jsx
import React, { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper";

export const ToolSetupArea = ({ toolId, onConfirm, onCancel, isLoading }) => {
  const { isNight } = useTheme();
  const [formData, setFormData] = useState({ subject: "MATHS", prompt: "" });

  const toolNames = { essay: "Bài tập Tự luận", quiz: "Trắc nghiệm vui" };

  return (
    <main className={`flex flex-1 flex-col items-center justify-center p-10 transition-colors ${
      isNight ? "bg-gray-900 text-white" : "bg-[#f8fafc] text-gray-800"
    }`}>
      <div className={`w-full max-w-2xl rounded-[32px] p-8 shadow-2xl ${
        isNight ? "bg-gray-800 border border-gray-700" : "bg-white"
      }`}>
        <h2 className="mb-6 text-3xl font-black text-[#4ecdc4]">
          Thiết lập {toolNames[toolId] || "Công cụ"}
        </h2>

        <div className="space-y-6">
          {/* Chọn môn học */}
          <div>
            <label className="mb-2 block font-bold opacity-80">Chọn môn học cho bé:</label>
            <div className="grid grid-cols-3 gap-3">
              {['MATHS', 'LITERATURE', 'ENGLISH'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setFormData({...formData, subject: sub})}
                  className={`rounded-2xl py-3 font-bold border-2 transition-all ${
                    formData.subject === sub 
                      ? "border-[#4ecdc4] bg-[#4ecdc4]/10 text-[#4ecdc4]" 
                      : "border-gray-200 opacity-50"
                  }`}
                >
                  {sub === 'MATHS' ? 'Toán' : sub === 'LITERATURE' ? 'Tiếng Việt' : 'Tiếng Anh'}
                </button>
              ))}
            </div>
          </div>

          {/* Nhập Prompt cụ thể */}
          <div>
            <label className="mb-2 block font-bold opacity-80">Ghi chú thêm cho Cú Mèo:</label>
            <textarea
              className={`w-full h-32 p-4 rounded-2xl border-2 outline-none focus:border-[#4ecdc4] transition-all resize-none ${
                isNight ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-100"
              }`}
              placeholder="Ví dụ: Ôn tập về phép nhân phân số, bài tập về danh từ..."
              value={formData.prompt}
              onChange={(e) => setFormData({...formData, prompt: e.target.value})}
            />
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={isLoading}
              onClick={() => onConfirm(formData)}
              className="flex-1 bg-[#4ecdc4] text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? "Đang soạn bài..." : "Bắt đầu tạo bài"}
            </button>
            <button onClick={onCancel} className="px-6 font-bold opacity-60">Quay lại</button>
          </div>
        </div>
      </div>
    </main>
  );
};