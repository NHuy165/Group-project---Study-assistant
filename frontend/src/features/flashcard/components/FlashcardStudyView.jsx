import React from 'react';
import useFlashcardNavigation from '../hooks/useFlashcard';
import Flashcard from './Flashcard';

const FlashcardStudyView = ({ data, isLoading, error }) => {
    const {
        currentCard,
        isFlipped,
        flipCard,
        nextCard,
        prevCard,
        isFirst,
        isLast,
        currentIndex,
        progress,
    } = useFlashcardNavigation(data);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải flashcard...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    <p className="text-2xl mb-4">📚</p>
                    <p className="text-gray-600 font-semibold">Chưa có flashcard nào!</p>
                    <p className="text-sm text-gray-500 mt-2">Hãy tạo một flashcard mới để bắt đầu học tập.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-4 bg-gray-200 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="text-center text-sm text-gray-500 mb-6">
                Thẻ {currentIndex + 1} / {data.length}
            </p>

            <Flashcard
                front={currentCard.front}
                back={currentCard.back}
                isFlipped={isFlipped}
                onClick={flipCard}
            />

            <div className="flex justify-between mt-8 gap-3">
                <button
                    onClick={prevCard}
                    disabled={isFirst}
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-30 hover:bg-gray-200 transition-colors"
                >
                    ← Trở về
                </button>
                <button
                    onClick={flipCard}
                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                >
                    🔄 Lật thẻ
                </button>
                <button
                    onClick={nextCard}
                    disabled={isLast}
                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-30 hover:bg-indigo-700 transition-colors"
                >
                    Tiếp theo →
                </button>
            </div>
        </div>
    );
};

export default FlashcardStudyView;
