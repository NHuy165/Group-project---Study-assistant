import React, { useState } from 'react';
import EvaluationWindow from './EvaluationWindow';
import { useEvaluation } from '../hooks/useEvaluation';

const EvaluationBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { assessment: evaluationData, isLoading: loading, error, fetchAssessment } = useEvaluation();

    const handleToggleEvaluation = async () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
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
        
        {/* Khung Evaluation hiển thị phía trên nút bot */}
        {isOpen && <EvaluationWindow data={evaluationData} loading={loading} error={error} />}

        {/* Biểu tượng Bot Evaluation (Nút kích hoạt) */}
        <button
            onClick={handleToggleEvaluation}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
            {isOpen ? (
            // Icon Đóng (Dấu X) khi đang mở
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ) : (
            // Icon Bot Evaluation khi đang đóng
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9c0-4.556 4.03-8.25 9-9-4.97 0-9 3.694-9 8.25zm0 0v.375c0 1.2-.836 2.196-1.99 2.466l-2.383.556-.556 2.383a2.5 2.5 0 01-4.861-.645V12A8.25 8.25 0 0121 12z" />
            </svg>
            )}
        </button>

        </div>
    );
};

export default EvaluationBot;