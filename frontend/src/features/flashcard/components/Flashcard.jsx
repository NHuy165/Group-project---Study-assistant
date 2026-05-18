import React from 'react';
import './Flashcard.css';

const Flashcard = ({ front, back, isFlipped, onClick, subject, isDarkMode }) => {
    const normalizedSubject = String(subject || 'VIETNAMESE').toUpperCase();
    const containerClasses = [
        'flashcard-container',
        isFlipped ? 'flipped' : '',
        normalizedSubject,
        isDarkMode ? 'night' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} onClick={onClick}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <div className="p-6 flex items-center justify-center text-center h-full">
                        <h3 className="flashcard-front-text text-xl font-semibold">{front}</h3>
                    </div>
                </div>
                
                <div className="flashcard-back">
                    <div className="p-6 flex items-center justify-center text-center h-full">
                        <p className="text-lg font-medium">{back}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Flashcard;
