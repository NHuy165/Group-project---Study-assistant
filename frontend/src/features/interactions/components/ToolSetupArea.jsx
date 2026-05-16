import React, { useState, useMemo } from "react";
import { useTheme } from "../../../components/theme/ThemeWrapper";
import { BookOpenText, Target, MagicWand, X, Sparkle, WarningCircle, Trash } from "@phosphor-icons/react";

export const ToolSetupArea = ({ toolId, onConfirm, onCancel, isLoading }) => {
  const { isNight } = useTheme();
  
  // States
  const [userInput, setUserInput] = useState("");
  const [subject, setSubject] = useState("LITERATURE");
  const [selectedSamples, setSelectedSamples] = useState([]);

  // Dữ liệu mẫu tùy theo tool
  const samples = useMemo(() => {
    if (toolId === 'essay') {
      return ["Kể về một kỷ niệm đáng nhớ", "Nêu cảm nghĩ về mẹ", "Miêu tả một con vật bé yêu thích"];
    }
    return ["Ôn tập kiến thức vừa học", "Câu hỏi trắc nghiệm nhanh", "Thử thách tư duy"];
  }, [toolId]);

  const toolInfo = useMemo(() => {
    switch (toolId) {
      case 'essay': return { title: 'Cấu hình Bài tập Tự luận', icon: <BookOpenText size={32} weight="fill" className="text-[#FF758F]" /> };
      case 'quiz': return { title: 'Cấu hình Trắc nghiệm', icon: <Target size={32} weight="fill" className="text-[#4ecdc4]" /> };
      default: return { title: `Cấu hình ${toolId}`, icon: <MagicWand size={32} weight="fill" className="text-purple-500" /> };
    }
  }, [toolId]);

  // [MỚI] Câu mô tả động thay vì fix cứng chữ "Tự luận"
  const toolDescription = useMemo(() => {
    if (toolId === 'essay') return "Bé sẽ viết thông tin để trả lời câu hỏi Tự Luận";
    if (toolId === 'quiz') return "Cú Mèo sẽ tạo các câu hỏi Trắc nghiệm nhiều lựa chọn";
    return `Bé sẽ tương tác với bài tập ${toolId}`;
  }, [toolId]);

  // Logic cộng dồn Prompt
  const handleToggleSample = (sample) => {
    setSelectedSamples(prev => 
      prev.includes(sample) ? prev.filter(s => s !== sample) : [...prev, sample]
    );
  };

  const isFormValid = userInput.trim().length > 0 || selectedSamples.length > 0;

  const handleConfirm = () => {
    if (!isFormValid) return;
    // Gộp prompt: Input + Các sample đã chọn
    const finalPrompt = [userInput.trim(), ...selectedSamples].filter(Boolean).join(". ");
    onConfirm({ subject, prompt: finalPrompt });
  };

  return (
    <div className={`absolute inset-0 z-[50] flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in zoom-in duration-300 rounded-[2.5rem] ${isNight ? 'bg-black/60' : 'bg-white/40'}`}>
      
      {/* THẺ CARD TRONG SUỐT (GLASSMORPHISM) */}
      <div className={`relative w-full max-w-[800px] rounded-[2.5rem] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl border transition-all ${
        isNight 
          ? "bg-[#1e293b]/90 border-white/10 text-gray-100" 
          : "bg-white/90 border-white/40 text-gray-800"
      }`}>
        
        {/* Nút X đóng nhanh */}
        <button onClick={onCancel} className="absolute right-8 top-8 text-gray-400 hover:text-red-500 transition-all hover:rotate-90 z-10">
          <X size={28} weight="bold" />
        </button>

        <header className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-2xl ${isNight ? 'bg-gray-800/80' : 'bg-gray-100'} shadow-sm`}>
            {toolInfo.icon}
          </div>
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-blue-400' : 'text-blue-600'}`}>
              {toolInfo.title}
            </h2>
            <p className="text-sm font-bold opacity-60">Cú Mèo sẽ dựa vào đây để ra đề cho bé</p>
          </div>
        </header>

        {/* VÙNG NHẬP LIỆU CHÍNH */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              className={`w-full h-44 p-6 rounded-[2rem] border-2 text-[1.2rem] leading-relaxed outline-none transition-all resize-none custom-scrollbar ${
                isNight 
                  ? "bg-gray-900/50 border-gray-700 focus:border-blue-400 text-white placeholder-gray-600" 
                  : "bg-white border-gray-200 focus:border-blue-500 text-gray-800 placeholder-gray-400"
              }`}
              placeholder="Nhập yêu cầu của bé hoặc dán văn bản vào đây..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            {userInput && (
              <button 
                onClick={() => setUserInput("")}
                className="absolute right-4 top-4 p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash size={16} weight="bold" />
              </button>
            )}
          </div>
          
          {/* CÁC CHIP GỢI Ý (MULTIPLE SELECT) */}
          <div className="flex flex-wrap gap-2 mt-5">
            {samples.map(sample => {
              const isSelected = selectedSamples.includes(sample);
              return (
                <button 
                  key={sample}
                  onClick={() => handleToggleSample(sample)}
                  className={`px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30 -translate-y-1"
                      : (isNight ? "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100")
                  }`}
                >
                  {isSelected && <Sparkle size={14} weight="fill" className="animate-pulse" />}
                  {sample}
                </button>
              );
            })}
          </div>
        </div>

        {/* KHỐI CẤU HÌNH DƯỚI */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className={`flex-1 p-5 rounded-3xl border-2 ${isNight ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
            <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest mb-4 opacity-70">
              📚 Chọn Môn học:
            </h4>
            <div className="flex gap-2">
              {[
                { id: 'LITERATURE', label: 'Tiếng Việt' },
                { id: 'MATHS', label: 'Toán' },
                { id: 'ENGLISH', label: 'Tiếng Anh' }
              ].map(sub => (
                <button key={sub.id} onClick={() => setSubject(sub.id)}
                  className={`flex-1 rounded-xl py-3 text-xs font-black transition-all border-2 ${
                    subject === sub.id 
                      ? "border-purple-500 bg-purple-500 text-white shadow-lg" 
                      : (isNight ? "border-gray-700 bg-gray-800 text-gray-500 hover:bg-gray-700" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50")
                  }`}>
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
          
           {/* [SỬA] Sử dụng biến toolDescription thay cho text cứng */}
           <div className={`flex-1 p-5 rounded-3xl border-2 flex flex-col justify-center items-center text-center ${isNight ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
             <p className="text-sm font-bold opacity-50 italic">
               {toolDescription}
             </p>
           </div>
        </div>

        {/* NÚT HÀNH ĐỘNG */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {!isFormValid && (
              <span className="text-red-500 text-xs font-bold flex items-center gap-1 animate-pulse">
                <WarningCircle size={16} /> Bé chưa nhập nội dung bài học!
              </span>
            )}
          </div>

          <button 
            disabled={isLoading || !isFormValid} 
            onClick={handleConfirm}
            className={`group flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${
              !isFormValid 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:-translate-y-1 shadow-purple-500/20"
            }`}
          >
            {isLoading ? (
              <Sparkle size={24} className="animate-spin" />
            ) : (
              <MagicWand size={24} weight="fill" className="group-hover:rotate-12 transition-transform" />
            )}
            {isLoading ? "ĐANG SOẠN BÀI..." : "BẮT ĐẦU TẠO BÀI"}
          </button>
        </div>

      </div>
    </div>
  );
};