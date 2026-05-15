import React, { useState } from 'react';
import useFlashcardManagement from '../hooks/useFlashcardManagement';

const emptyDraft = {
    front: '',
    back: '',
};

const FlashcardEditView = ({ selectedSet, onBack, onStudy }) => {
    const {
        cardsList,
        isLoading,
        error,
        createNewFlashcard,
        updateCard,
    } = useFlashcardManagement(selectedSet?.id);

    const [newCard, setNewCard] = useState(emptyDraft);
    const [editingCardId, setEditingCardId] = useState(null);
    const [editingCard, setEditingCard] = useState(emptyDraft);

    const updateNewCard = (field, value) => {
        setNewCard((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateEditingCard = (field, value) => {
        setEditingCard((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddCard = async () => {
        const createdCard = await createNewFlashcard(
            selectedSet.id,
            newCard.front,
            newCard.back,
        );

        if (createdCard) {
            setNewCard(emptyDraft);
        }
    };

    const handleStartEdit = (card) => {
        setEditingCardId(card.id);
        setEditingCard({
            front: card.front || '',
            back: card.back || '',
        });
    };

    const handleCancelEdit = () => {
        setEditingCardId(null);
        setEditingCard(emptyDraft);
    };

    const handleSaveEdit = async (cardId) => {
        const updatedCard = await updateCard(
            cardId,
            editingCard.front,
            editingCard.back,
        );

        if (updatedCard) {
            handleCancelEdit();
        }
    };

    const canAddCard = newCard.front.trim() && newCard.back.trim();
    const canSaveEdit = editingCard.front.trim() && editingCard.back.trim();

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
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
                        onClick={onStudy}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        Học bộ này
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                    >
                        Trở về
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="mb-3 text-base font-bold text-slate-800">
                    Thêm thẻ mới
                </h4>

                <div className="grid gap-3 md:grid-cols-2">
                    <textarea
                        className="min-h-28 resize-none rounded-lg border border-slate-200 p-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        value={newCard.front}
                        onChange={(e) => updateNewCard('front', e.target.value)}
                        placeholder="Mặt trước"
                        disabled={isLoading}
                    />
                    <textarea
                        className="min-h-28 resize-none rounded-lg border border-slate-200 p-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        value={newCard.back}
                        onChange={(e) => updateNewCard('back', e.target.value)}
                        placeholder="Mặt sau"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleAddCard}
                    disabled={isLoading || !canAddCard}
                    className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isLoading ? 'Đang lưu...' : 'Thêm thẻ'}
                </button>
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-800">
                        Toàn bộ thẻ
                    </h4>
                    <span className="text-sm font-medium text-slate-500">
                        {cardsList.length} thẻ
                    </span>
                </div>

                {isLoading && cardsList.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
                        Đang tải flashcard...
                    </div>
                ) : cardsList.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                        Bộ này chưa có thẻ nào. Thêm thẻ đầu tiên ở phía trên.
                    </div>
                ) : (
                    cardsList.map((card, index) => {
                        const isEditing = editingCardId === card.id;

                        return (
                            <article
                                key={card.id}
                                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <span className="text-sm font-bold text-slate-500">
                                        Thẻ {index + 1}
                                    </span>

                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSaveEdit(card.id)}
                                                disabled={isLoading || !canSaveEdit}
                                                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(card)}
                                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    {isEditing ? (
                                        <>
                                            <textarea
                                                className="min-h-28 resize-none rounded-lg border border-slate-200 p-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                                value={editingCard.front}
                                                onChange={(e) => updateEditingCard('front', e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <textarea
                                                className="min-h-28 resize-none rounded-lg border border-slate-200 p-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                                value={editingCard.back}
                                                onChange={(e) => updateEditingCard('back', e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="min-h-24 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                                                {card.front}
                                            </div>
                                            <div className="min-h-24 rounded-lg bg-indigo-50 p-3 text-sm leading-6 text-indigo-900">
                                                {card.back}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default FlashcardEditView;
