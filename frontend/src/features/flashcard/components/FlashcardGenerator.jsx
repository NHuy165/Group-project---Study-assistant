import React, { useState } from 'react';

const FlashcardGenerator = ({
    isLoading,
    error,
    prompt,
    setPrompt,
    onCreateFlashcardSet,
    onCreateEmptyFlashcardSet,
}) => {
    const [emptySetForm, setEmptySetForm] = useState({
        name: '',
        subject_type: 'ENGLISH',
        description: '',
    });

    const updateEmptySetForm = (field, value) => {
        setEmptySetForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCreateEmptySet = async () => {
        const createdSet = await onCreateEmptyFlashcardSet(emptySetForm);

        if (createdSet) {
            setEmptySetForm({
                name: '',
                subject_type: 'ENGLISH',
                description: '',
            });
        }
    };

    const canCreateEmptySet = (
        emptySetForm.name.trim() &&
        emptySetForm.subject_type.trim() &&
        emptySetForm.description.trim()
    );

    return (
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
            <section className="rounded-lg border border-dashed border-indigo-300 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-indigo-600">
                    Tạo bộ Flashcard với AI
                </h2>

                {error && (
                    <div className="mb-3 rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <textarea
                    className="min-h-32 w-full resize-none rounded-lg border border-slate-200 p-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Nhập nội dung hoặc chủ đề, ví dụ: 10 từ vựng về nấu ăn..."
                    rows="5"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                />

                <button
                    type="button"
                    onClick={() => onCreateFlashcardSet(prompt)}
                    disabled={isLoading || !prompt.trim()}
                    className="mt-3 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isLoading ? 'Đang tạo...' : 'Tạo bằng AI'}
                </button>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Tạo bộ Flashcard trống
                </h2>

                <div className="space-y-3">
                    <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-600">
                            Tên bộ thẻ
                        </span>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            value={emptySetForm.name}
                            onChange={(e) => updateEmptySetForm('name', e.target.value)}
                            placeholder="Ví dụ: Unit 4 vocabulary"
                            disabled={isLoading}
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-600">
                            Môn học
                        </span>
                        <select
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            value={emptySetForm.subject_type}
                            onChange={(e) => updateEmptySetForm('subject_type', e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="ENGLISH">Tiếng Anh</option>
                            <option value="MATHS">Toán</option>
                            <option value="VIETNAMESE">Tiếng Việt</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-600">
                            Mô tả
                        </span>
                        <textarea
                            className="min-h-24 w-full resize-none rounded-lg border border-slate-200 p-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            value={emptySetForm.description}
                            onChange={(e) => updateEmptySetForm('description', e.target.value)}
                            placeholder="Mục tiêu hoặc nội dung chính của bộ thẻ"
                            disabled={isLoading}
                        />
                    </label>
                </div>

                <button
                    type="button"
                    onClick={handleCreateEmptySet}
                    disabled={isLoading || !canCreateEmptySet}
                    className="mt-3 w-full rounded-lg border border-indigo-200 bg-indigo-50 py-2.5 font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                    {isLoading ? 'Đang tạo...' : 'Tạo bộ trống'}
                </button>
            </section>
        </div>
    );
};

export default FlashcardGenerator;
