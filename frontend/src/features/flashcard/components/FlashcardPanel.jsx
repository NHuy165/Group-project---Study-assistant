import React, { useState } from 'react';
import FlashcardEditView from './FlashcardEditView';
import FlashcardGenerator from './FlashcardGenerator';
import FlashcardStudyView from './FlashcardStudyView';

const FlashcardPanel = ({
  flashcardSets = [],
  isLoading,
  onCreateFlashcardSet,
  onCreateEmptyFlashcardSet,
  onRemoveFlashcardSet,
  error,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState('sets');
  const [selectedSet, setSelectedSet] = useState(null);
  const [generatorPrompt, setGeneratorPrompt] = useState('');

  const handleStudySet = (set) => {
    setSelectedSet(set);
    setViewMode('study');
  };

  const handleEditSet = (set) => {
    setSelectedSet(set);
    setViewMode('edit');
  };

  const handleRemoveSet = async (setId) => {
    await onRemoveFlashcardSet(setId);
    if (selectedSet?.id === setId) {
      setSelectedSet(null);
      setViewMode('sets');
    }
  };

  const handleBackToSets = () => {
    setSelectedSet(null);
    setViewMode('sets');
  };

  const handleCreateWithAi = async (text) => {
    const createdSet = await onCreateFlashcardSet(text);

    if (createdSet) {
      setGeneratorPrompt('');
      setViewMode('sets');
    }
  };

  const handleCreateEmptySet = async (formData) => {
    const createdSet = await onCreateEmptyFlashcardSet(formData);

    if (createdSet) {
      setSelectedSet(createdSet);
      setViewMode('edit');
    }

    return createdSet;
  };

  const renderSets = () => (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {flashcardSets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="font-semibold text-slate-700">Chưa có bộ flashcard nào</p>
          <p className="mt-1 text-sm text-slate-500">
            Tạo bằng AI hoặc tạo bộ trống để thêm thẻ thủ công.
          </p>
          <button
            type="button"
            onClick={() => setViewMode('create')}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Tạo bộ mới
          </button>
        </div>
      ) : (
        flashcardSets.map((set) => (
          <article
            key={set.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800">
                {set.name || 'Untitled flashcard set'}
              </h3>

              {set.description && (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {set.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleStudySet(set)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
              >
                Học bộ này
              </button>

              <button
                type="button"
                onClick={() => handleEditSet(set)}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                Chỉnh sửa
              </button>

              <button
                type="button"
                onClick={() => handleRemoveSet(set.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
              >
                Xóa
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );

  const renderContent = () => (
    <div className="flex-1 overflow-auto p-5 md:p-6">
      {viewMode === 'create' && (
        <FlashcardGenerator
          isLoading={isLoading}
          error={error}
          prompt={generatorPrompt}
          setPrompt={setGeneratorPrompt}
          onCreateFlashcardSet={handleCreateWithAi}
          onCreateEmptyFlashcardSet={handleCreateEmptySet}
        />
      )}

      {viewMode === 'sets' && renderSets()}

      {viewMode === 'study' && (
        <FlashcardStudyView
          selectedSet={selectedSet}
          onBack={handleBackToSets}
          onEdit={() => setViewMode('edit')}
        />
      )}

      {viewMode === 'edit' && (
        <FlashcardEditView
          selectedSet={selectedSet}
          onBack={handleBackToSets}
          onStudy={() => setViewMode('study')}
        />
      )}
    </div>
  );

  const renderHeader = () => (
    <>
      <header className="border-b border-slate-100 px-5 pb-4 pt-5 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              <span className="mr-2 text-indigo-500">+</span>
              Flashcard
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tạo, chỉnh sửa và học bộ thẻ ghi nhớ của bạn
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng flashcard"
            title="Đóng"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-4 md:px-6">
        <button
          type="button"
          onClick={() => setViewMode('sets')}
          className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
            viewMode === 'sets' || viewMode === 'study' || viewMode === 'edit'
              ? 'bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Bộ thẻ
        </button>

        <button
          type="button"
          onClick={() => setViewMode('create')}
          className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
            viewMode === 'create'
              ? 'bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tạo mới
        </button>
      </div>
    </>
  );

  return (
    <aside className="flex h-full w-full min-w-[360px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl">
      {renderHeader()}
      {renderContent()}
    </aside>
  );
};

export default FlashcardPanel;
