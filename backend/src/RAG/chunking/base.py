from abc import ABC, abstractmethod

from fastapi import UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.core.config import settings
from backend.src.models_schema.document.document import Document
from backend.src.models_schema.document.document_analysis import (
    DocumentAnalysis,
    DocumentAnalysisSchema,
    MaterialRecommendation,
    QuestionRecommendation,
)

smart_splitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.DEFAULT_CHUNK_SIZE,
    chunk_overlap=settings.DEFAULT_CHUNK_OVERLAP,
    separators=["\n\n", "\n", ".", " ", ""],
)


class DocumentExtractor(ABC):
    @classmethod
    @abstractmethod
    def verify(cls, file: UploadFile) -> bool:
        """
        Verifies whether a file is of a certain format.
        """
        pass

    @classmethod
    @abstractmethod
    async def extract(
        cls, session: AsyncSession, file: UploadFile, document: Document
    ) -> DocumentAnalysis | None:
        """
        Extracts and saves chunks.
        """
        pass


def save_document_analysis(
    session: AsyncSession,
    analysis: str,
) -> DocumentAnalysis:
    validated_analysis = DocumentAnalysisSchema.model_validate_json(analysis)

    material_recommendations = []
    for material_recommendation_schema in validated_analysis.material_recommendations:
        material_recommendation = MaterialRecommendation(
            **material_recommendation_schema.model_dump()
        )
        material_recommendations.append(material_recommendation)

    question_recommendations = []
    for question_recommendation_schema in validated_analysis.question_recommendations:
        question_recommendation = QuestionRecommendation(
            **question_recommendation_schema.model_dump()
        )
        question_recommendations.append(question_recommendation)

    document_analysis = DocumentAnalysis(
        summary=validated_analysis.summary,
        material_recommendations=material_recommendations,
        question_recommendations=question_recommendations,
    )

    session.add_all(material_recommendations)
    session.add_all(question_recommendations)
    session.add(document_analysis)

    return document_analysis
