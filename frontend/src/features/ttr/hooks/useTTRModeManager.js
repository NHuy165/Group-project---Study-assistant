import { useState, useEffect, useCallback } from 'react';

export const useTTRModeManager = (mode, totalQuestions, streak) => {
  // --- STATE CHẾ ĐỘ TỐC ĐỘ (SPEED) ---
  const [timeLeft, setTimeLeft] = useState(45); // Quỹ thời gian 45s
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);

  // --- STATE CHẾ ĐỘ SINH TỒN (SURVIVAL) ---
  const [shields, setShields] = useState(0); // Số lớp khiên
  const [isFogActive, setIsFogActive] = useState(mode === 'survival'); // Bật sương mù mặc định

  // --- STATE KẾT THÚC ---
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(''); // 'time_up' hoặc 'one_hit_ko'

  // Tính mốc linh hoạt (Áp dụng chung logic với TTRCard)
  const baseStreak = totalQuestions > 0 ? Math.min(totalQuestions, 10) : 10;
  const streakMid = Math.max(1, Math.round(baseStreak * 0.4));
  const streakHigh = Math.max(2, Math.round(baseStreak * 0.7));

  // ==========================================
  // LOGIC 1: ĐẾM NGƯỢC THỜI GIAN (SPEED MODE)
  // ==========================================
  useEffect(() => {
    if (mode !== 'speed' || isGameOver || isTimeFrozen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setGameOverReason('time_up');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isGameOver, isTimeFrozen]);

  // ==========================================
  // LOGIC 2: ĐẶC QUYỀN STREAK (ĐÓNG BĂNG & KHIÊN & LỬA)
  // ==========================================
  useEffect(() => {
    if (streak === 0) {
      if (mode === 'survival') setIsFogActive(true); // Mất chuỗi -> Sương mù ập lại
      return;
    }

    // Đặc quyền Tốc Độ: Đóng băng
    if (mode === 'speed') {
      if (streak === streakMid || streak === streakHigh) {
        setIsTimeFrozen(true);
        const freezeTime = streak === streakHigh ? 5000 : 3000; // Mốc cao đóng băng 5s, vừa thì 3s
        setTimeout(() => setIsTimeFrozen(false), freezeTime);
      }
    }

    // Đặc quyền Sinh Tồn: Khiên & Xóa sương mù
    if (mode === 'survival') {
      if (streak === streakMid) setShields(prev => prev + 1); // Được +1 Khiên bảo mệnh
      if (streak >= streakHigh) setIsFogActive(false);        // Đánh tan sương mù
    }
  }, [streak, mode, streakMid, streakHigh]);

  // ==========================================
  // LOGIC 3: XỬ LÝ PHẠT/THƯỞNG KHI BẤM "KIỂM TRA"
  // ==========================================
  const processAnswerTime = useCallback((isFullCorrect, isAnyWrong, newlyCorrectCount) => {
    if (mode !== 'speed') return;
    setTimeLeft(prev => {
      let newTime = prev;
      if (isFullCorrect) newTime += 5; // Hoàn thành cả câu: +5s
      else if (newlyCorrectCount > 0) newTime += (newlyCorrectCount * 2); // Đúng 1 ô: +2s
      
      if (isAnyWrong) newTime -= 5; // Có ô sai: Trừ 5s
      return Math.max(newTime, 0);  // Không cho âm
    });
  }, [mode]);

  const processSurvivalDamage = useCallback(() => {
    if (mode !== 'survival') return false; // Không phải sinh tồn -> Không xử lý sát thương
    
    if (shields > 0) {
      setShields(prev => prev - 1);
      return false; // Còn khiên -> Phá 1 khiên, sống sót!
    }
    
    // Hết khiên mà sai -> Tạch luôn
    setIsGameOver(true);
    setGameOverReason('one_hit_ko');
    return true; 
  }, [mode, shields]);

  return {
    timeLeft, isTimeFrozen,
    shields, isFogActive,
    isGameOver, gameOverReason,
    processAnswerTime, processSurvivalDamage
  };
};