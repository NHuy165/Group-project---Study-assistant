import React from 'react';
import useFlashcardNavigation from '../hooks/useFlashcard';
import Flashcard from './Flashcard';
import useFlashcardManagement from '../hooks/useFlashcardManagement';

const FlashcardStudyView = ({ selectedSet, onBack }) => {

    const {
        cardsList,
        isLoading,
        error,
        removeFlashcard,
    } = useFlashcardManagement(selectedSet?.id);
    
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
    } = useFlashcardNavigation(cardsList);

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

    if (!cardsList || cardsList.length === 0) {
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
        <div className="mx-auto flex max-w-2xl flex-col gap-5 p-4">
        <div className="flex items-start justify-between gap-4">
            <div>
            <h3 className="text-lg font-bold text-slate-800">
                {selectedSet?.name || 'Flashcard set'}
            </h3>
            {selectedSet?.description && (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                {selectedSet.description}
                </p>
            )}
            </div>

            <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
            >
            Trở về
            </button>
        </div>

        <div>
            <div className="mb-3 h-2 rounded-full bg-slate-200">
            <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
            />
            </div>

            <p className="text-center text-sm font-medium text-slate-500">
            Thẻ {currentIndex + 1} / {cardsList.length}
            </p>
        </div>

        <Flashcard
            front={currentCard.front}
            back={currentCard.back}
            isFlipped={isFlipped}
            onClick={flipCard}
        />

        <div className="grid grid-cols-3 gap-3">
            <button
            type="button"
            onClick={prevCard}
            disabled={isFirst}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
            Trước
            </button>

            <button
            type="button"
            onClick={flipCard}
            className="rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
            >
            Lật thẻ
            </button>

            <button
            type="button"
            onClick={nextCard}
            disabled={isLast}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
            Sau
            </button>
        </div>
        </div>

    );
};

export default FlashcardStudyView;
