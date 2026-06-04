from pydantic import BaseModel


class AugmentationParams(BaseModel):
    prompt: str


class AnswerGenerationParams(AugmentationParams):
    context_conversations: str
    context_document: str
    personal_information: str


class StudyActivityParams(AugmentationParams):
    context_conversations: str
    context_document: str
    subject_type: str
    json_schema: str
    activity_format: str
    personal_information: str


class PromptRewriteParams(AugmentationParams):
    context_conversations: str


class GradingParams(AugmentationParams):
    creation_prompt: str
    context_document: str


class DocumentAnalysisParams(AugmentationParams):
    name: str
    subject_type: str
    document_type: str
    personal_information: str
