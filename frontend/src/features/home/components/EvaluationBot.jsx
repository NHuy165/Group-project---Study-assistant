import React, { useState } from 'react';
import EvaluationWindow from './EvaluationWindow';
import { useEvaluation } from '../hooks/useEvaluation';

const EvaluationBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const { 
        todayAssessment,       
        historyList,           
        totalHistory,
        detailAssessment,      
        isDetailLoading,
        isLoading: loading, 
        error, 
        detailError,       // Khai báo lấy biến lỗi từ hook useEvaluation
        setDetailError,    // Khai báo lấy hàm reset lỗi từ hook useEvaluation
        fetchAssessment,
        readHistory,
        readDetailByDay,       
        setDetailAssessment   
    } = useEvaluation(true);   

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
            {isOpen && (
                <EvaluationWindow
                    data={todayAssessment}
                    loading={loading}
                    error={error}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    
                    historyList={historyList}
                    totalHistory={totalHistory}
                    onFetchHistory={readHistory}
                    
                    detailAssessment={detailAssessment}
                    isDetailLoading={isDetailLoading}
                    detailError={detailError} // Truyền trạng thái lỗi xuống Window
                    onFetchDetail={readDetailByDay}
                    
                    // KHI RESET DETAIL: Xóa sạch cả dữ liệu cũ lẫn lỗi của ngày tra cứu trước đó
                    onResetDetail={() => {
                        setDetailAssessment(null);
                        setDetailError(null);
                    }}
                />
            )}

            <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300" />
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