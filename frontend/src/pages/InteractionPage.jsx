import { useParams } from 'react-router-dom';

export const InteractionPage = () => {
    const { interactionId } = useParams();

    return (
        <div>
            <ChatWindow interactionId={interactionId} />
            <DocumentList interactionId={interactionId} />
            <NoteList interactionId={interactionId} />
        </div>
    );
};