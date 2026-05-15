import React, { useState } from 'react';
import { Cards, MagicWand, Sparkle, WarningCircle } from '@phosphor-icons/react';
import { useTheme } from '../../../components/theme/ThemeWrapper';

const SUGGESTED_PROMPTS = [
    '10 từ vựng tiếng Anh về trường học',
    'Công thức Toán cần ghi nhớ',
    'Khái niệm chính của bài vừa học',
];

const SUBJECTS = [
    { id: 'ENGLISH', label: 'Tiếng Anh' },
    { id: 'MATHS', label: 'Toán' },
    { id: 'VIETNAMESE', label: 'Tiếng Việt' },
    { id: 'OTHER', label: 'Khác' },
];

const FlashcardGenerator = ({
    isLoading,
    error,
    prompt,
    setPrompt,
    onCreateFlashcardSet,
    onCreateEmptyFlashcardSet,
}) => {
    const { isNight } = useTheme();
    const [selectedSamples, setSelectedSamples] = useState([]);
    const [createMode, setCreateMode] = useState('ai');
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

    const toggleSample = (sample) => {
        setSelectedSamples((prev) => (
            prev.includes(sample) ? prev.filter((item) => item !== sample) : [...prev, sample]
        ));
    };

    const finalPrompt = [prompt.trim(), ...selectedSamples].filter(Boolean).join('. ');
    const canCreateWithAi = finalPrompt.trim().length > 0;
    const canCreateEmptySet = (
        emptySetForm.name.trim() &&
        emptySetForm.subject_type.trim() &&
        emptySetForm.description.trim()
    );
    const canSubmit = createMode === 'ai' ? canCreateWithAi : canCreateEmptySet;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        if (createMode === 'ai') {
            const createdSet = await onCreateFlashcardSet(finalPrompt);
            if (createdSet) {
                setPrompt('');
                setSelectedSamples([]);
            }
            return;
        }

        const createdSet = await onCreateEmptyFlashcardSet(emptySetForm);
        if (createdSet) {
            setEmptySetForm({
                name: '',
                subject_type: 'ENGLISH',
                description: '',
            });
        }
    };

    return (
        <div className={`mx-auto w-full max-w-4xl rounded-[2rem] border p-6 shadow-xl transition-colors md:p-8 ${
            isNight
                ? 'border-white/10 bg-[#1e293b]/95 text-gray-100'
                : 'border-white/60 bg-white text-gray-800'
        }`}>
            <header className="mb-7 flex items-center gap-4">
                <div className={`rounded-2xl p-4 shadow-sm ${isNight ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                    <Cards size={34} weight="fill" className="text-indigo-500" />
                </div>
                <div>
                    <h2 className={`text-3xl font-black tracking-tight ${isNight ? 'text-indigo-300' : 'text-indigo-700'}`}>
                        Cấu hình Flashcard
                    </h2>
                    <p className="text-sm font-bold opacity-60">
                        Tạo bộ thẻ bằng AI hoặc tạo bộ trống để nhập thủ công.
                    </p>
                </div>
            </header>

            {error && (
                <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700">
                    {error}
                </div>
            )}

            <div className="mb-6 grid grid-cols-2 gap-3">
                {[
                    { id: 'ai', label: 'Tạo bằng AI' },
                    { id: 'empty', label: 'Tạo bộ trống' },
                ].map((mode) => (
                    <button
                        key={mode.id}
                        type="button"
                        onClick={() => setCreateMode(mode.id)}
                        className={`rounded-2xl border-2 px-4 py-3 text-sm font-black transition-all ${
                            createMode === mode.id
                                ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : (isNight ? 'border-gray-700 bg-gray-900/50 text-gray-400 hover:bg-gray-800' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100')
                        }`}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>

            {createMode === 'ai' ? (
                <div className="mb-8">
                    <textarea
                        className={`h-44 w-full resize-none rounded-[2rem] border-2 p-6 text-[1.05rem] leading-relaxed outline-none transition-all custom-scrollbar ${
                            isNight
                                ? 'border-gray-700 bg-gray-900/60 text-white placeholder-gray-500 focus:border-indigo-400'
                                : 'border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-indigo-500'
                        }`}
                        placeholder="Nhập nội dung, chủ đề hoặc dán văn bản để AI tạo flashcard..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                    />

                    <div className="mt-5 flex flex-wrap gap-2">
                        {SUGGESTED_PROMPTS.map((sample) => {
                            const isSelected = selectedSamples.includes(sample);
                            return (
                                <button
                                    key={sample}
                                    type="button"
                                    onClick={() => toggleSample(sample)}
                                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${
                                        isSelected
                                            ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : (isNight ? 'border-gray-700 bg-gray-800/60 text-gray-400 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100')
                                    }`}
                                >
                                    {isSelected && <Sparkle size={14} weight="fill" />}
                                    {sample}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block text-sm font-black opacity-70">Tên bộ thẻ</span>
                        <input
                            className={`w-full rounded-2xl border-2 px-4 py-3 outline-none transition ${
                                isNight
                                    ? 'border-gray-700 bg-gray-900/60 text-white placeholder-gray-500 focus:border-indigo-400'
                                    : 'border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-indigo-500'
                            }`}
                            value={emptySetForm.name}
                            onChange={(e) => updateEmptySetForm('name', e.target.value)}
                            placeholder="Ví dụ: Unit 4 vocabulary"
                            disabled={isLoading}
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-black opacity-70">Môn học</span>
                        <select
                            className={`w-full rounded-2xl border-2 px-4 py-3 outline-none transition ${
                                isNight
                                    ? 'border-gray-700 bg-gray-900/60 text-white focus:border-indigo-400'
                                    : 'border-gray-200 bg-white text-gray-800 focus:border-indigo-500'
                            }`}
                            value={emptySetForm.subject_type}
                            onChange={(e) => updateEmptySetForm('subject_type', e.target.value)}
                            disabled={isLoading}
                        >
                            {SUBJECTS.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block md:col-span-2">
                        <span className="mb-2 block text-sm font-black opacity-70">Mô tả</span>
                        <textarea
                            className={`h-32 w-full resize-none rounded-[2rem] border-2 p-5 outline-none transition ${
                                isNight
                                    ? 'border-gray-700 bg-gray-900/60 text-white placeholder-gray-500 focus:border-indigo-400'
                                    : 'border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-indigo-500'
                            }`}
                            value={emptySetForm.description}
                            onChange={(e) => updateEmptySetForm('description', e.target.value)}
                            placeholder="Mục tiêu hoặc nội dung chính của bộ thẻ"
                            disabled={isLoading}
                        />
                    </label>
                </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {!canSubmit ? (
                    <span className="flex items-center gap-2 text-xs font-bold text-red-500">
                        <WarningCircle size={16} weight="fill" />
                        Vui lòng nhập đủ thông tin để tạo flashcard.
                    </span>
                ) : (
                    <span className="text-xs font-bold opacity-50">
                        Nội dung đã sẵn sàng để tạo bộ flashcard.
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !canSubmit}
                    className={`group flex items-center justify-center gap-3 rounded-2xl px-10 py-4 font-black text-white shadow-xl transition-all active:scale-95 ${
                        !canSubmit
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/20 hover:-translate-y-1 hover:from-indigo-600 hover:to-purple-700'
                    }`}
                >
                    {isLoading ? (
                        <Sparkle size={24} className="animate-spin" />
                    ) : (
                        <MagicWand size={24} weight="fill" className="transition-transform group-hover:rotate-12" />
                    )}
                    {isLoading ? 'Đang tạo...' : 'Bắt đầu tạo flashcard'}
                </button>
            </div>
        </div>
    );
};

export default FlashcardGenerator;
