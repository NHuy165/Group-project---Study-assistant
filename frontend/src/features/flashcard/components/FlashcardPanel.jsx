import React, { useEffect, useState } from 'react';
import FlashcardEditView from './FlashcardEditView';
import FlashcardGenerator from './FlashcardGenerator';
import FlashcardStudyView from './FlashcardStudyView';

const FlashcardPanel = ({
  isLoading,
  onCreateFlashcardSet,
  onCreateEmptyFlashcardSet,
  error,
  onClose,
  initialViewMode = 'create',
  initialSelectedSet = null,
}) => {
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [selectedSet, setSelectedSet] = useState(initialSelectedSet);
  const [generatorPrompt, setGeneratorPrompt] = useState('');

  useEffect(() => {
    setViewMode(initialViewMode);
    setSelectedSet(initialSelectedSet);
  }, [initialViewMode, initialSelectedSet]);

  const handleCreateWithAi = async (text) => {
    const createdSet = await onCreateFlashcardSet(text);

    if (createdSet) {
      setGeneratorPrompt('');
      onClose();
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

  const isCreateMode = viewMode === 'create';

  const renderContent = () => (
    <>
      {isCreateMode && (
        <FlashcardGenerator
          isLoading={isLoading}
          error={error}
          prompt={generatorPrompt}
          setPrompt={setGeneratorPrompt}
          onCreateFlashcardSet={handleCreateWithAi}
          onCreateEmptyFlashcardSet={handleCreateEmptySet}
        />
      )}

      {viewMode === 'study' && (
        <FlashcardStudyView
          selectedSet={selectedSet}
          onBack={onClose}
          onEdit={() => setViewMode('edit')}
        />
      )}

      {viewMode === 'edit' && (
        <FlashcardEditView
          selectedSet={selectedSet}
          onBack={onClose}
          onStudy={() => setViewMode('study')}
        />
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[calc(100vh-2rem)] w-full overflow-auto animate-in fade-in zoom-in-95 duration-300 ${
          isCreateMode
            ? 'max-w-[800px]'
            : 'max-w-[1100px] rounded-[3rem] bg-white p-6 shadow-2xl'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Đóng flashcard"
          title="Đóng"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {renderContent()}
      </div>
    </div>
  );
};

export default FlashcardPanel;
