import React, { useState } from 'react';
import { TTRSetupModal } from './components/TTRSetupModal';
import { TTRFeature } from './index'; // Chính là cái index.jsx chứa game
import { createTTRActivity } from './api/ttrApi';

export const TTRContainer = ({ interactionId, onClose }) => {
  const [step, setStep] = useState('setup'); // 'setup' | 'loading' | 'game'
  const [activityId, setActivityId] = useState(null);

  const handleStartCreation = async (finalPrompt) => {
    try {
      setStep('loading');
      const data = await createTTRActivity(interactionId, { prompt: finalPrompt });
      setActivityId(data.id);
      setStep('game');
    } catch (error) {
      alert("Lỗi: " + error.message);
      setStep('setup');
    }
  };

  if (step === 'setup' || step === 'loading') {
    return (
      <TTRSetupModal 
        isOpen={true} 
        isLoading={step === 'loading'} 
        onClose={onClose} 
        onSubmit={handleStartCreation} 
      />
    );
  }

  return <TTRFeature activityId={activityId} onClose={onClose} />;
};