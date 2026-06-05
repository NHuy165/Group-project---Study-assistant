import React, { useState } from 'react';
import EvaluationWindow from './EvaluationWindow';
import { useEvaluation } from '../hooks/useEvaluation';

const EvaluationBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Đặt autoFetch = true để tự động gọi createStudentAssessment khi truy cập Homepage
    const { 
        assessment: evaluationData, 
        history,
        totalHistory,
        isLoading: loading, 
        error, 
        fetchAssessment,
        readHistory
    } = useEvaluation(true); 

    const handleToggleEvaluation = async () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        // Nếu người dùng chủ động click mở chat box, ta có thể refresh lại data hôm nay cho chắc chắn
        if (nextState) {
            try {
                await fetchAssessment();
            } catch (err) {
                console.error('Failed to fetch assessment:', err);
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">

            {isOpen && (
                <EvaluationWindow
                    data={evaluationData}
                    loading={loading}
                    error={error}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    // Truyền tiếp các dữ liệu và hàm xử lý lịch sử phân trang xuống UI
                    history={history}
                    totalHistory={totalHistory}
                    onFetchHistory={readHistory}
                />
            )}

            {/* Avatar Bot có hiệu ứng click thông minh */}
            <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300 animate-pulse" />
                <img
                    alt="Robot AI"
                    src="/src/features/home/assets/robot-purple.png"
                    onClick={handleToggleEvaluation}
                    className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white"
                />
            </div>

        </div>
    );
};

export default EvaluationBot;