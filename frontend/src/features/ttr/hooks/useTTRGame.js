import { useState, useCallback } from 'react';
import { MOCK_TTR_SESSION } from '../data/mockData';

export const useTTRGame = () => {
  // 1. Quản lý trạng thái tiến độ
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // 2. Trạng thái của câu hỏi hiện tại ('idle' | 'correct' | 'wrong')
  const [status, setStatus] = useState('idle');
  
  // 3. Từ vựng bé đang chọn / điền vào
  const [selectedWord, setSelectedWord] = useState(null);

  // Lấy câu hỏi hiện tại ra
  const currentQuestion = MOCK_TTR_SESSION[currentIndex];
  const totalQuestions = MOCK_TTR_SESSION.length;

  // Hàm xử lý khi bé bấm chọn 1 từ
  const handleSelectWord = useCallback((word) => {
    if (status === 'correct') return; // Nếu đã đúng rồi thì không cho bấm nữa

    setSelectedWord(word);

    if (word === currentQuestion.correctWord) {
      // ĐÚNG
      setStatus('correct');
      setStreak(prev => prev + 1);
      // Gọi API báo BE cộng điểm Mastery ở đây (sau này làm)
      
      // Đợi 1.5s để xem hiệu ứng rồi tự động chuyển câu
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);

    } else {
      // SAI
      setStatus('wrong');
      setStreak(0); // Rớt chuỗi
      
      // Đợi 0.8s cho nó rung lắc xong rồi reset lại ô trống
      setTimeout(() => {
        setSelectedWord(null);
        setStatus('idle');
      }, 800);
    }
  }, [currentQuestion, status]);

  // Hàm chuyển câu
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedWord(null);
      setStatus('idle');
    } else {
      alert("Chúc mừng bé đã hoàn thành bài tập!");
      // Xử lý logic kết thúc session (hiện bảng điểm, thoát...)
    }
  }, [currentIndex, totalQuestions]);

  // Hàm thoát game
  const handleExit = () => {
    const confirm = window.confirm("Bé có chắc muốn thoát không? Tiến độ sẽ không được lưu.");
    if (confirm) {
      console.log("Thoát về màn hình chính");
      // Dùng react-router-dom để navigate về home
    }
  };

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    streak,
    status,
    selectedWord,
    handleSelectWord,
    handleExit
  };
};