import { useState, useCallback, useEffect } from 'react';
import { fetchStudyActivity } from '../api/ttrApi';


const mapBackendDataToGameFormat = (backendData) => {
  const items = backendData.items || [];

  return items.map((item, index) => {
    const textContentObj = item.contents.find(c => c.type === 'GAP_FILL_TEXT');
    const correctContents = item.contents.filter(c => c.type === 'GAP_FILL_CORRECT');
    const distractorContents = item.contents.filter(c => c.type === 'GAP_FILL_DISTRACTOR');

    const textString = textContentObj ? textContentObj.content : "";
    const correctWords = correctContents.map(c => c.content);
    const distractors = distractorContents.map(c => c.content);

    const textChunks = textString.split(/\$!BLANK!\$|\[BLANK\]|___/);

    const blanks = correctWords.map((word, i) => ({
      id: `q${index}-b${i}`,
      correctWord: word
    }));

    const allOptions = [...correctWords, ...distractors];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    return {
      id: `q${index}`,
      textChunks: textChunks,
      blanks: blanks,
      options: shuffledOptions
    };
  });
};

export const useTTRGame = (studyActivityId, onClose, initialMode = 'play') => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeBlankId, setActiveBlankId] = useState(null); 
  const [filledBlanks, setFilledBlanks] = useState({});     
  const [wrongBlanks, setWrongBlanks] = useState([]);       
  const [confirmedBlanks, setConfirmedBlanks] = useState([]); 
  const [checkStatus, setCheckStatus] = useState('idle');   

  const [power5050, setPower5050] = useState(0);         
  const [powerMagic, setPowerMagic] = useState(0);       
  const [shieldActive, setShieldActive] = useState(false); 
  const [eliminatedOptions, setEliminatedOptions] = useState([]);

  const [isReviewMode, setIsReviewMode] = useState(initialMode === 'review');

  const [isCompleted, setIsCompleted] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      if (!studyActivityId) return;
      try {
        setIsLoading(true);
        const beData = await fetchStudyActivity(studyActivityId);
        const formattedQuestions = mapBackendDataToGameFormat(beData);
        setQuestions(formattedQuestions);
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu bài tập. Vui lòng thử lại!");
        setIsLoading(false);
      }
    };
    loadData();
  }, [studyActivityId]);

  const totalQuestions = questions.length;

  useEffect(() => {
    if (streak > 0 && totalQuestions > 0) {
      // Xác định "mốc cơ sở": tối đa là 10, tối thiểu là số lượng câu thực tế
      const base = Math.min(totalQuestions, 10);

      // Tính toán các mốc linh hoạt
      const step3 = Math.max(1, Math.round(base * 0.3)); // Tương ứng 3/10
      const step5 = Math.max(1, Math.round(base * 0.5)); // Tương ứng 5/10
      const step7 = Math.max(1, Math.round(base * 0.7)); // Tương ứng 7/10

      if (streak % step3 === 0) setPower5050(prev => prev + 1);
      if (streak % step5 === 0) setPowerMagic(prev => prev + 1);
      if (streak % step7 === 0) setShieldActive(true);
    }
  }, [streak, totalQuestions]);

  const currentQuestion = questions.length > 0 ? questions[currentIndex] : null;

  // 3. AUTO ĐIỀN ĐÁP ÁN NẾU LÀ CHẾ ĐỘ REVIEW
  useEffect(() => {
    if (isReviewMode && currentQuestion) {
      const autoFilled = {};
      const rights = [];
      currentQuestion.blanks.forEach(b => {
        autoFilled[b.id] = b.correctWord;
        rights.push(b.id);
      });
      setFilledBlanks(autoFilled);
      setConfirmedBlanks(rights);
      setCheckStatus('success');
    } else {
      // Nếu không phải review (tức là play)
      if (currentQuestion && currentQuestion.blanks.length > 0) setActiveBlankId(currentQuestion.blanks[0].id);
      setFilledBlanks({});
      setWrongBlanks([]);
      setConfirmedBlanks([]); 
      setCheckStatus('idle');
      setEliminatedOptions([]); 
    }
  }, [currentIndex, currentQuestion, isReviewMode]);

  const handleUse5050 = useCallback(() => {
    if (power5050 <= 0 || checkStatus === 'success' || !currentQuestion) return;
    const correctWords = currentQuestion.blanks.map(b => b.correctWord);
    const wrongOptions = currentQuestion.options.filter(opt => !correctWords.includes(opt) && !eliminatedOptions.includes(opt));
    const numToRemove = Math.max(1, Math.floor(wrongOptions.length / 2));
    const removed = [...wrongOptions].sort(() => 0.5 - Math.random()).slice(0, numToRemove);
    setEliminatedOptions(prev => [...prev, ...removed]);
    setPower5050(prev => prev - 1); 
  }, [power5050, checkStatus, currentQuestion, eliminatedOptions]);

  const handleUseMagic = useCallback(() => {
    if (powerMagic <= 0 || checkStatus === 'success' || !currentQuestion) return;
    const targetBlank = currentQuestion.blanks.find(b => !confirmedBlanks.includes(b.id));
    if (targetBlank) {
      setFilledBlanks(prev => ({ ...prev, [targetBlank.id]: targetBlank.correctWord }));
      setConfirmedBlanks(prev => [...prev, targetBlank.id]);
      setPowerMagic(prev => prev - 1); 
      const nextEmpty = currentQuestion.blanks.find(b => b.id !== targetBlank.id && !confirmedBlanks.includes(b.id));
      setActiveBlankId(nextEmpty ? nextEmpty.id : null);
    }
  }, [powerMagic, checkStatus, currentQuestion, confirmedBlanks]);

  const handleSelectWord = useCallback((word) => {
    if (!activeBlankId || checkStatus === 'success' || !currentQuestion) return;
    setFilledBlanks(prev => {
      const newFilled = { ...prev, [activeBlankId]: word };
      const nextEmpty = currentQuestion.blanks.find(b => b.id !== activeBlankId && !newFilled[b.id] && !confirmedBlanks.includes(b.id));
      setActiveBlankId(nextEmpty ? nextEmpty.id : null);
      return newFilled;
    });
  }, [activeBlankId, checkStatus, currentQuestion, confirmedBlanks]);

  const handleDropWord = useCallback((word, targetBlankId) => {
    if (checkStatus === 'success' || confirmedBlanks.includes(targetBlankId) || !currentQuestion) return;
    setFilledBlanks(prev => {
      const newFilled = { ...prev, [targetBlankId]: word };
      const nextEmpty = currentQuestion.blanks.find(b => !newFilled[b.id] && !confirmedBlanks.includes(b.id));
      setActiveBlankId(nextEmpty ? nextEmpty.id : null);
      return newFilled;
    });
  }, [checkStatus, confirmedBlanks, currentQuestion]);
  
  const handleBlankClick = useCallback((blankId) => {
    if (checkStatus === 'success' || confirmedBlanks.includes(blankId)) return;
    if (filledBlanks[blankId]) {
      const newFilled = { ...filledBlanks };
      delete newFilled[blankId];
      setFilledBlanks(newFilled);
    }
    setActiveBlankId(blankId); 
  }, [filledBlanks, checkStatus, confirmedBlanks]);

  const handleCheckAnswer = () => {
    let wrongs = [], rights = [];
    currentQuestion.blanks.forEach(b => {
      if (filledBlanks[b.id] !== b.correctWord) wrongs.push(b.id);
      else rights.push(b.id); 
    });

    if (wrongs.length === 0) {
      setCheckStatus('success');
      setConfirmedBlanks(rights);
      setStreak(prev => prev + 1);
      setActiveBlankId(null);
    } else {
      setCheckStatus('wrong');
      setWrongBlanks(wrongs);
      setConfirmedBlanks(prev => [...new Set([...prev, ...rights])]); 
      
      if (shieldActive) {
        setShieldActive(false); 
      } else {
        setStreak(0); 
      }

      setTimeout(() => {
        setFilledBlanks(prev => {
          const newF = { ...prev };
          wrongs.forEach(id => delete newF[id]);
          return newF;
        });
        setWrongBlanks([]);
        setCheckStatus('idle');
        setActiveBlankId(wrongs[0]); 
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else { 
      // THAY VÌ ALERT, BẬT CỜ HOÀN THÀNH LÊN ĐỂ TTRCARD BÙNG NỔ!
      setIsCompleted(true); 
    }
  };

  const toggleReviewMode = useCallback((active) => {
    setIsReviewMode(active);
  }, []);

  return {
    isLoading, error, isReviewMode, toggleReviewMode,
    isCompleted,
    currentIndex, totalQuestions, currentQuestion: questions[currentIndex],
    activeBlankId, filledBlanks, wrongBlanks, confirmedBlanks, checkStatus, streak,
    power5050, powerMagic, shieldActive, eliminatedOptions,
    
    // TRẢ VỀ ĐÚNG TÊN ĐỂ TTRCARD GỌI
    onSelectWord: handleSelectWord,     
    onDropWord: handleDropWord,         
    onBlankClick: handleBlankClick,    
    onCheckAnswer: handleCheckAnswer,   
    onNextQuestion: handleNextQuestion,
    onExit: onClose, // TRUYỀN HÀM ONCLOSE VÀO NÚT (X) TRÊN THẺ BÀI TẬP
    handleUse5050, handleUseMagic,
  };
};