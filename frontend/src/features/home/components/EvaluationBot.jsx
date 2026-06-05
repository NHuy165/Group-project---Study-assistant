import React, { useState } from 'react';
import EvaluationWindow from './EvaluationWindow';
import { useEvaluation } from '../hooks/useEvaluation';


const EvaluationBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Use the imported presentational component `EvaluationWindow` (defined in EvaluationWindow.jsx)

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

        {isOpen && (
            <EvaluationWindow
                data={evaluationData}
                loading={loading}
                error={error}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        )}

        <img
            alt="Robot"
            src="/src/features/home/assets/robot-purple.png"
            onClick={handleToggleEvaluation}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95`}
        />

        </div>
    );
};



export default EvaluationBot;