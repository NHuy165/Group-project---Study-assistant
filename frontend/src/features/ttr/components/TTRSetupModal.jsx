import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../components/theme/ThemeWrapper'; 

const SUGGESTED_PROMPTS = [
  "Tóm tắt định luật bảo toàn năng lượng.", 
  "Ôn tập chương 2 môn Khoa học.", 
  "Từ vựng tiếng Anh chủ đề Động vật."
];

export const TTRSetupModal = ({ isOpen, onClose, onSubmit }) => {
  const { isNight } = useTheme();
  const [content, setContent] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState('normal'); 
  const [difficulty, setDifficulty] = useState('easy'); 
  const [questionCount, setQuestionCount] = useState(10);

  // Reset form khi mở lại Modal
  useEffect(() => { 
    if (isOpen) { 
      setContent(''); 
      setSelectedPrompts([]); 
      setErrorMsg(''); 
    } 
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && selectedPrompts.length === 0) {
      setErrorMsg('❌ Bé ơi, nhập nội dung hoặc chọn gợi ý nhé!');
      return;
    }

    // 1. Lấy Nội dung (A)
    const finalContent = [content.trim(), ...selectedPrompts].filter(Boolean).join('\n\n');
    
    // 2. Dịch độ khó thành quy định số ô trống
    let blankRule = "1 đến 2";
    if (difficulty === 'medium') blankRule = "3 đến 4";
    // Nên để 5-6 thay vì >5 để con AI kiểm soát độ dài câu tốt hơn, không bị lố
    if (difficulty === 'hard') blankRule = "5 đến 6"; 

    // 3. Gom thành Prompt (Bỏ hoàn toàn biến 'mode' ra khỏi đây)
    const finalPrompt = `
      Hãy tạo một bài tập điền từ vào chỗ trống (Gap Fill). 
      Nội dung/Chủ đề: ${finalContent}. 
      Yêu cầu:
      - Số lượng: Tạo chính xác ${questionCount} câu hỏi.
      - Độ khó: Mỗi câu hỏi phải đục từ ${blankRule} chỗ trống cần điền.
      - QUY ĐỊNH QUAN TRỌNG: Chỉ sử dụng cụm từ [BLANK] để đại diện cho các chỗ trống. Tuyệt đối không sử dụng $!BLANK!$ hay bất kỳ ký hiệu nào khác.
    `;

    // Truyền finalPrompt đi (sau này nếu bạn cần code UI cho chế độ sinh tồn, 
    // bạn có thể truyền thêm object { prompt: finalPrompt, gameMode: mode } thay vì chỉ truyền chuỗi)
    onSubmit({ prompt: finalPrompt, gameMode: mode });
  };

  const togglePrompt = (p) => {
    setSelectedPrompts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className={`fixed inset-0 z-[110] flex flex-col items-center justify-center p-6 backdrop-blur-md animate-in fade-in zoom-in duration-300 rounded-[2.5rem] ${isNight ? 'bg-black/60' : 'bg-white/40'}`}>
      
      {/* THAY ĐỔI THẺ CARD CHÍNH (Đồng bộ max-w-[800px], bo góc, padding và màu Glassmorphism) */}
      <div className={`relative w-full max-w-[800px] rounded-[2.5rem] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl border transition-all ${
        isNight 
          ? "bg-[#1e293b]/90 border-white/10 text-gray-100" 
          : "bg-white/90 border-white/40 text-gray-800"
      }`}>
        
        {/* Nút X đóng nhanh (Giữ nguyên logic onClose, đồng bộ style vị trí của ToolSetupArea) */}
        <button onClick={onClose} className="absolute right-8 top-8 text-gray-400 hover:text-red-500 transition-all hover:rotate-90 z-10">
          <span className="text-2xl font-bold">✕</span>
        </button>

        <header className="mb-6 flex items-center gap-3">
          <span className="text-4xl">🧠</span>
          <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-gray-100' : 'text-blue-600'}`}>Cấu hình Tap To Review</h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nhập nội dung */}
          <div className={`rounded-2xl p-5 border ${isNight ? 'bg-[#1e252e] border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <textarea 
              value={content}
              onChange={(e) => { setContent(e.target.value); setErrorMsg(''); }}
              placeholder="Nhập nội dung bài học hoặc dán văn bản vào đây..."
              className={`h-32 w-full rounded-xl border p-4 text-base outline-none transition-all resize-none ${
                isNight ? 'border-gray-600 bg-[#2d3540] focus:border-purple-500 text-white placeholder-gray-400' : 'border-gray-300 bg-gray-50 focus:border-purple-600 text-gray-800'
              }`}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button key={i} type="button" onClick={() => togglePrompt(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedPrompts.includes(p) ? 'bg-purple-600 border-purple-700 text-white' : (isNight ? 'bg-[#2d3540] border-gray-600 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700')
                  }`}>{p}</button>
              ))}
            </div>
            {errorMsg && <p className="mt-3 text-red-500 text-xs font-bold animate-bounce">{errorMsg}</p>}
          </div>

          {/* Chế độ & Độ khó */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl p-4 border ${isNight ? 'bg-[#1e252e] border-gray-700' : 'bg-white border-gray-200'}`}>
              <p className="text-sm font-bold mb-3 flex items-center gap-2">🕹️ Chế độ:</p>
              <div className="flex gap-2">
                {['normal', 'speed', 'survival'].map(m => (
                  <button key={m} type="button" onClick={() => setMode(m)} className={`flex-1 p-2 rounded-xl border-2 text-[10px] font-bold transition-all uppercase ${mode === m ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-gray-600 text-gray-400 hover:border-gray-500'}`}>
                    {m === 'normal' ? 'ÔN TẬP' : m === 'speed' ? 'TỐC ĐỘ' : 'SINH TỒN'}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-4 border ${isNight ? 'bg-[#1e252e] border-gray-700' : 'bg-white border-gray-200'}`}>
              <p className="text-sm font-bold mb-3 flex items-center gap-2">📶 Độ khó:</p>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button key={d} type="button" onClick={() => setDifficulty(d)} className={`flex-1 p-2 rounded-xl border-2 text-[10px] font-bold transition-all uppercase ${difficulty === d ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-gray-600 text-gray-400 hover:border-gray-500'}`}>
                    {d === 'easy' ? 'DỄ' : d === 'medium' ? 'VỪA' : 'KHÓ'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Thanh chọn số câu & Nút Submit */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
            <div className="w-full md:w-1/2 flex items-center gap-4">
              <span className="text-sm font-bold whitespace-nowrap">Số câu: {questionCount}</span>
              <input type="range" min="5" max="20" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} className="w-full accent-purple-600"/>
            </div>
            <button type="submit" className="w-full md:w-auto bg-purple-600 text-white px-10 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 shadow-lg transition-all flex items-center justify-center gap-2">
              🌟 BẮT ĐẦU TẠO BÀI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};