import React from 'react';
import { BlankSlot } from './BlankSlot';
import { useTheme } from '../../../components/theme/ThemeWrapper'; 

export const TTRCard = ({ 
  isCompleted,
  currentIndex, totalQuestions, 
  currentQuestion, activeBlankId, filledBlanks, wrongBlanks, confirmedBlanks, checkStatus, 
  streak, onSelectWord, onBlankClick, onDropWord, onCheckAnswer, onNextQuestion, onExit,
  power5050, powerMagic, shieldActive, eliminatedOptions, handleUse5050, handleUseMagic 
}) => {
  const { isNight } = useTheme();
  if (!currentQuestion) return null;


  if (isCompleted) {
    // 1. Tính toán lại mốc để phân loại Màn hình chiến thắng
    const baseStreak = totalQuestions > 0 ? Math.min(totalQuestions, 10) : 10;
    const streakMid = Math.max(1, Math.round(baseStreak * 0.4));
    const streakHigh = Math.max(2, Math.round(baseStreak * 0.7));

    // 2. Xác định hạng (Tier)
    const isTier2 = streak >= streakMid && streak < streakHigh; // Khá
    const isTier3 = streak >= streakHigh; // Cực kỳ bùng nổ

    return (
      <main className={`flex w-full min-h-[580px] flex-col items-center justify-center rounded-[2.5rem] p-8 backdrop-blur-md shadow-2xl transition-all duration-700 relative overflow-hidden
        ${isNight ? 'bg-[#151b23]/95 border-gray-700' : 'bg-white/95 border-gray-200'}
        ${isTier3 ? (isNight ? 'shadow-[0_0_100px_rgba(250,204,21,0.4)]' : 'shadow-[0_0_100px_rgba(250,204,21,0.6)]') : ''}
        ${isTier2 ? (isNight ? 'shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'shadow-[0_0_40px_rgba(168,85,247,0.3)]') : ''}
      `}>
        <style>
          {`
            /* Hiệu ứng chữ Vàng Kim (Shimmer Gold) dành riêng cho Tier 3 */
            .shimmer-text {
              background: linear-gradient(90deg, #F59E0B 0%, #FEF08A 50%, #F59E0B 100%);
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              animation: shimmer 2s linear infinite;
            }
            @keyframes shimmer { to { background-position: 200% center; } }
            
            /* Vụ nổ Zoom-in mạnh cho Tier 3 */
            @keyframes supernova-boom {
              0% { transform: scale(0.5); opacity: 0; filter: brightness(2); }
              60% { transform: scale(1.1); opacity: 1; filter: brightness(1.2); }
              100% { transform: scale(1); opacity: 1; filter: brightness(1); }
            }
            
            /* Pháo hoa */
            @keyframes burst {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
          `}
        </style>

        {/* HIỆU ỨNG PHÁO HOA CHỈ HIỆN Ở TIER 2 (15 tia) VÀ TIER 3 (40 tia) */}
        {(isTier2 || isTier3) && (
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {[...Array(isTier3 ? 40 : 15)].map((_, i) => { 
              const numParticles = isTier3 ? 40 : 15;
              const angle = (i * 360) / numParticles; 
              const distance = (isTier3 ? 150 : 100) + Math.random() * (isTier3 ? 250 : 100); 
              const tx = `${Math.cos((angle * Math.PI) / 180) * distance}px`;
              const ty = `${Math.sin((angle * Math.PI) / 180) * distance}px`;
              
              const lightness = isNight ? '65%' : '45%';
              // Tier 3: Toàn bộ hạt pháo hoa màu Vàng/Cam rực rỡ. Tier 2: Trộn màu pastel.
              const color = isTier3 
                ? `hsl(${Math.random() * 50 + 20}, 100%, ${lightness})` 
                : `hsl(${Math.random() * 360}, 70%, ${lightness})`; 
              
              return (
                <div key={i} className={`absolute rounded-full ${isTier3 ? 'w-3 h-3' : 'w-2 h-2'}`}
                     style={{
                       backgroundColor: color, 
                       boxShadow: `0 0 ${isTier3 ? '15px' : '5px'} ${color}`,
                       '--tx': tx, '--ty': ty,
                       animation: `burst ${1 + Math.random() * (isTier3 ? 1.5 : 0.5)}s cubic-bezier(0.1, 0.8, 0.3, 1) infinite`,
                       animationDelay: `${Math.random() * 0.4}s`
                     }}
                />
              );
            })}
          </div>
        )}
        
        {/* NỘI DUNG CHÍNH (Thay đổi theo cấp độ) */}
        <div className={`z-10 flex flex-col items-center ${isTier3 ? 'animate-[supernova-boom_0.6s_ease-out_forwards]' : 'animate-in zoom-in duration-500'}`}>
          
          {/* ICON THƯỞNG */}
          <div className={`mb-2 leading-none drop-shadow-2xl ${isTier3 ? 'text-[120px]' : (isTier2 ? 'text-[90px]' : 'text-[70px]')}`}>
            {isTier3 ? '🏆' : (isTier2 ? '🌟' : '👏')}
          </div>
          
          {/* LỜI CHÚC MỪNG */}
          <h2 className={`font-black mb-4 drop-shadow-md text-center ${isTier3 ? 'text-6xl shimmer-text' : (isTier2 ? 'text-5xl text-yellow-500' : `text-4xl ${isNight ? 'text-purple-400' : 'text-purple-600'}`)}`}>
            {isTier3 ? 'XUẤT SẮC!' : 'CHÚC MỪNG BÉ!'}
          </h2>
          
          <p className={`text-xl font-bold mb-8 ${isNight ? 'text-gray-300' : 'text-gray-600'}`}>
            Đã hoàn thành bài tập
          </p>
          
          {/* KHUNG THỂ HIỆN STREAK */}
          <div className={`px-8 py-4 rounded-3xl border-2 mb-10 transform hover:scale-105 transition-all 
            ${isTier3 ? (isNight ? 'bg-gray-800/80 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'bg-yellow-50 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)]') 
            : (isNight ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200')}
          `}>
            <span className={`text-lg font-bold flex items-center gap-2 ${isTier3 ? 'text-yellow-600' : (isNight ? 'text-gray-300' : 'text-gray-700')}`}>
              <span className="text-3xl animate-pulse">{isTier3 ? '🔥' : '🎯'}</span> 
              Chuỗi đúng liên tiếp: 
              <span className={`text-3xl font-black ml-1 ${isTier3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500' : (isNight ? 'text-purple-400' : 'text-purple-600')}`}>
                {streak}
              </span> câu
            </span>
          </div>

          {/* NÚT BẤM QUAY VỀ */}
          <button onClick={onExit} className={`px-10 py-4 font-black text-xl rounded-2xl transition-all shadow-xl hover:scale-110 active:scale-95 border-b-4
            ${isTier3 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-orange-700 hover:brightness-110' 
              : (isNight ? 'bg-purple-600 text-white border-purple-800 hover:bg-purple-500' : 'bg-gray-900 text-white border-gray-700 hover:bg-black')
            }
          `}>
            QUAY VỀ HỌC LIỆU
          </button>
        </div>
      </main>
    );
  }

  
  const usedWords = Object.values(filledBlanks);
  const isAllFilled = Object.keys(filledBlanks).length === currentQuestion.blanks.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;


  const baseGlow = totalQuestions > 0 ? Math.min(totalQuestions, 10) : 10;
  const stepGlowSmall = Math.max(1, Math.round(baseGlow * 0.2)); // Thay cho mốc 2 cứng
  const stepGlowBig = Math.max(1, Math.round(baseGlow * 0.5));   // Thay cho mốc 5 cứng

  // HIỆU ỨNG HÀO QUANG (Càng cao càng rực rỡ)
  let glowEffect = '';
  if (streak >= stepGlowBig) {
    glowEffect = isNight ? 'shadow-[0_0_50px_rgba(168,85,247,0.6)] ring-2 ring-purple-400' : 'shadow-[0_0_50px_rgba(250,204,21,0.6)] ring-2 ring-yellow-400';
  } else if (streak >= stepGlowSmall) {
    glowEffect = isNight ? 'shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-500/50' : 'shadow-[0_0_20px_rgba(250,204,21,0.3)] ring-1 ring-yellow-400/50';
  }

 return (
    <main className={`flex w-full min-h-[580px] flex-col items-center rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-500 border border-white/20 relative overflow-hidden
      ${isNight ? 'bg-[#151b23]/90 shadow-[0_20px_50px_rgba(0,0,0,0.7)]' : 'bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}
      ${shieldActive ? '-translate-y-2' : ''} 
      ${glowEffect}
    `}>
      <style>{`
        @keyframes vanish {
          0% { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 0; transform: scale(0); filter: blur(5px); display: none; }
        }
        .animate-vanish { animation: vanish 0.5s ease-out forwards; pointer-events: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
        
        /* HIỆU ỨNG MƯA SAO BĂNG CHUẨN LOGIC HƯỚNG BAY (Góc chéo 45 độ, từ phải qua trái) */
        @keyframes meteor {
          0% { transform: rotate(-45deg) translateX(200px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: rotate(-45deg) translateX(-1500px); opacity: 0; }
        }
        .meteor {
          position: absolute;
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
          transform: rotate(-45deg);
          animation: meteor 2s linear infinite;
        }
        /* Tạo các tia bay ở tọa độ khác nhau */
        .m-1 { top: 0%; left: 80%; animation-delay: 0s; }
        .m-2 { top: -20%; left: 50%; animation-delay: 0.8s; width: 150px; }
        .m-3 { top: 30%; left: 110%; animation-delay: 1.5s; width: 300px; }
        .m-4 { top: 10%; left: 100%; animation-delay: 2.2s; background: linear-gradient(90deg, rgba(168,85,247,0), rgba(168,85,247,1)); }
      `}</style>

      {/* RENDER MƯA SAO BĂNG KHI STREAK >= 5 */}
      {streak >= stepGlowBig && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="meteor m-1"></div>
          <div className="meteor m-2"></div>
          <div className="meteor m-3"></div>
          <div className={isNight ? "meteor m-4" : "meteor m-4 opacity-50"}></div>
        </div>
      )}

      {/* CÁC THÀNH PHẦN CÒN LẠI CỦA BẠN GIỮ NGUYÊN BÊN DƯỚI (Nhớ bọc z-10 để không bị vệt sao đè lên chữ) */}
      <div className="relative z-10 flex w-full items-center justify-between mb-8 px-2 gap-4">
        {/* ... (Đoạn button onClose và Progress Bar giữ nguyên) ... */}
        <button onClick={onExit} className={`flex items-center justify-center w-10 h-10 rounded-[14px] border transition-all ${
          isNight ? 'border-gray-600 bg-gray-800/80 text-gray-400 hover:text-white' : 'border-gray-300 bg-gray-100 text-gray-600 hover:text-red-500'
        }`}>✕</button>

        <div className={`flex-1 h-5 rounded-full relative overflow-hidden shadow-inner ${isNight ? 'bg-[#1e293b]' : 'bg-gray-200'}`}>
          <div className="absolute top-0 left-0 h-full bg-[#1de9b6] transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-black tracking-[0.2em] z-10 ${
            isNight ? 'text-white drop-shadow-lg' : 'text-teal-950 drop-shadow-sm'
          }`}>
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 z-10 ${
          isNight ? 'bg-[#1e293b] text-gray-300' : 'bg-gray-800 text-gray-100'
        } ${shieldActive ? 'shadow-[0_0_15px_rgba(56,189,248,0.6)] ring-2 ring-sky-400' : ''}`}>
          {shieldActive && <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-sky-300 animate-spin-slow opacity-50 pointer-events-none" />}
          <span className={streak > 0 ? "text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)] animate-pulse text-lg" : "text-gray-500 opacity-50"}>🔥</span>
          <span className="text-lg">x{streak}</span>
          {shieldActive && <span className="text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)] ml-1">🛡️</span>}
        </div>
      </div>

      <div className={`relative z-10 w-full mt-2 mb-10 px-8 text-center text-[1.4rem] font-medium leading-[4rem] tracking-wide ${isNight ? 'text-gray-100' : 'text-gray-900'}`}>
        {currentQuestion.textChunks.map((chunk, idx) => (
          <React.Fragment key={`chunk-${idx}`}>
            <span>{chunk}</span>
            {idx < currentQuestion.blanks.length && (
              <BlankSlot
                isActive={activeBlankId === currentQuestion.blanks[idx].id}
                filledWord={filledBlanks[currentQuestion.blanks[idx].id]}
                isWrong={wrongBlanks.includes(currentQuestion.blanks[idx].id)}
                isSuccess={checkStatus === 'success' || confirmedBlanks.includes(currentQuestion.blanks[idx].id)}
                onClick={() => onBlankClick(currentQuestion.blanks[idx].id)}
                onDropWord={(word) => onDropWord(word, currentQuestion.blanks[idx].id)}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <hr className={`relative z-10 w-full border-t mb-6 ${isNight ? 'border-gray-600/50' : 'border-gray-200'}`} />

      {/* ... Phần Nút Đáp án và Nút Kiểm tra của bạn giữ nguyên y đúc ... */}
      <div className="relative z-10 flex w-full flex-wrap justify-center gap-4 mb-4 px-4 min-h-[60px]">
        {currentQuestion.options.map((word, idx) => {
          const isUsed = usedWords.includes(word);
          const isEliminated = eliminatedOptions && eliminatedOptions.includes(word);
          const isDisabled = isUsed || checkStatus === 'success' || isEliminated;

          return (
            <button key={idx} onClick={() => onSelectWord(word)} draggable={!isDisabled && !isEliminated} 
              onDragStart={(e) => { e.dataTransfer.setData("text/plain", word); e.target.style.opacity = '0.5'; }}
              onDragEnd={(e) => { e.target.style.opacity = '1'; }}
              disabled={isDisabled || isEliminated}
              className={`px-6 py-3 text-lg font-bold rounded-xl transition-all border-2
                ${isEliminated ? 'animate-vanish' : ''} 
                ${isDisabled && !isEliminated
                  ? (isNight ? 'border-dashed border-gray-600 bg-transparent text-gray-600 cursor-not-allowed opacity-50' : 'border-dashed border-gray-300 bg-transparent text-gray-400 cursor-not-allowed opacity-50')
                  : (!isEliminated && (isNight
                      ? 'bg-gray-800 border-gray-500 text-gray-200 hover:bg-gray-700 hover:-translate-y-1 hover:border-purple-400 shadow-md cursor-grab active:cursor-grabbing'
                      : 'bg-white border-gray-200 text-purple-700 hover:bg-purple-50 hover:-translate-y-1 hover:border-purple-500 shadow-md cursor-grab active:cursor-grabbing'))
                }
              `}
            >
              {word}
            </button>
          );
        })}
      </div>

      <div className="relative z-10 w-full flex items-end justify-between mt-auto pt-4 pb-2">
        <div className="flex gap-3">
          <button onClick={handleUse5050} disabled={!power5050 || checkStatus === 'success'} title="Loại bỏ một nửa đáp án sai"
            className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 font-black text-xl transition-all ${
              power5050 > 0 && checkStatus !== 'success'
                ? 'bg-blue-500/20 border-blue-400 text-blue-400 hover:bg-blue-500/30 hover:scale-110 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer' 
                : (isNight ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-50' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50')
            }`}>
            ✂️
            {power5050 > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{power5050}</span>}
          </button>

          <button onClick={handleUseMagic} disabled={!powerMagic || checkStatus === 'success'} title="Tự động điền 1 đáp án đúng"
            className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 font-black text-xl transition-all ${
              powerMagic > 0 && checkStatus !== 'success'
                ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-400 hover:bg-fuchsia-500/30 hover:scale-110 hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] cursor-pointer' 
                : (isNight ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-50' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50')
            }`}>
            🔮
            {powerMagic > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{powerMagic}</span>}
          </button>
        </div>

        <div className="flex-1 flex justify-center pl-8">
          {checkStatus !== 'success' ? (
            <button onClick={onCheckAnswer} disabled={!isAllFilled || checkStatus === 'checking'}
              className={`w-[80%] max-w-[280px] py-4 rounded-2xl text-xl font-extrabold transition-all duration-300 border-2 ${
                isAllFilled ? 'bg-purple-600 border-purple-500 text-white hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(147,51,234,0.4)]' : 'bg-gray-100/10 border-gray-600/30 text-gray-500 cursor-not-allowed shadow-none' 
              }`}>
              Kiểm tra đáp án
            </button>
          ) : (
            <button onClick={onNextQuestion}
              className="w-[80%] max-w-[280px] py-4 rounded-2xl text-xl font-extrabold text-white transition-all duration-300 bg-[#1de9b6] hover:bg-[#15c39a] hover:scale-105 active:scale-95 border-2 border-teal-400 shadow-[0_8px_30px_rgba(29,233,182,0.5)] animate-in slide-in-from-bottom-4">
              Tiếp tục ➔
            </button>
          )}
        </div>
        <div className="w-[124px] hidden sm:block pointer-events-none"></div>
      </div>
    </main>
  );
};