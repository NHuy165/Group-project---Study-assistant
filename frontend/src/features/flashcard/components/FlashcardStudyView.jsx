import React from 'react';
import useFlashcardNavigation from '../hooks/useFlashcard';
import Flashcard from './Flashcard';
import useFlashcardManagement from '../hooks/useFlashcardManagement';

const FlashcardStudyView = ({ selectedSet, onBack, onEdit }) => {
    const {
        cardsList,
        isLoading,
        error,
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
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
                    <p className="mt-4 text-gray-600">Đang tải flashcard...</p>
                </div>
            </div>
        );
    }

    if (!cardsList || cardsList.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="max-w-md text-center">
                    {error && (
                        <div className="mb-4 rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <p className="text-lg font-semibold text-slate-700">
                        Bộ này chưa có flashcard nào
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        Chuyển sang chỉnh sửa để thêm thẻ đầu tiên.
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={onEdit}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            Trở về
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
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

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="shrink-0 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                    >
                        Chỉnh sửa
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                    >
                        Trở về
                    </button>
                </div>
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
