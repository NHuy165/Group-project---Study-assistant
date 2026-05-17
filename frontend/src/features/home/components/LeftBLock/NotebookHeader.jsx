import React from "react";
import { WelcomeCard } from "./WelcomeCard";
import { CreateNotebookCard } from "./CreateNotebookCard";
import { LearningPathCard } from "./LearningPathCard";
import { RecentNotebooksCard } from "./RecentNotebooksCard";
import { StreakCard } from "./StreakCard";
import { useInteractions } from "../../../interactions/hooks/useInteractions";

export const NotebookHeader = () => {
  const { 
    interactions, 
    isLoading, 
    formData, 
    handleFormChange, 
    createInteraction 
  } = useInteractions();

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await createInteraction({
      name: formData.name.trim(),
      description: formData.description.trim() || "..."
    });
  };

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-2 custom-scrollbar">
      <WelcomeCard name="Minh" />
      
      <CreateNotebookCard 
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleCreateSubmit}
        isLoading={isLoading}
      />
      
      <LearningPathCard />
      
      <RecentNotebooksCard 
        interactions={interactions} 
        isLoading={isLoading} 
      />
      
      <StreakCard dayCount={3} />
    </div>
  );
};