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
        className={`relative max-h-[calc(100vh-2rem)] w-full animate-in fade-in zoom-in-95 duration-300 ${
          isCreateMode
            ? 'max-w-[800px] overflow-auto'
            : 'max-w-[1100px]'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-50 text-2xl text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Đóng flashcard"
          title="Đóng"
        >✕</button> */}
        {isCreateMode && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-8 top-8 z-50 text-gray-400 transition-all hover:rotate-90 hover:text-red-500"
            aria-label="Đóng flashcard"
            title="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>
            </svg>
          </button>
        )}
          {/* <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg> */}
        

        {renderContent()}
      </div>
    </div>
  );
};

export default FlashcardPanel;
