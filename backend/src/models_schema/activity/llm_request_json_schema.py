from typing import Any

from sqlmodel import SQLModel

# ----- GRADING SCHEMAS ----- #

# === Base models === #


class ForGradingItemSchema(SQLModel):
    id: int
    question: str
    attempt: Any


class ForGradingSchema(SQLModel):
    items: list[ForGradingItemSchema]


# === Open ended === #


class OpenEndedForGradingItemSchema(ForGradingItemSchema):
    max_score: float
    attempt: str | None


class OpenEndedForGradingSchema(ForGradingSchema):
    items: list[OpenEndedForGradingItemSchema]


# === MCQ === #


class MCQForGradingItemContentSchema(SQLModel):
    id: int
    content: str
    is_correct: bool


class MCQForGradingItemSchema(ForGradingItemSchema):
    attempt: int | None
    contents: list[MCQForGradingItemContentSchema]
    user_score: float


class MCQForGradingSchema(ForGradingSchema):
    items: list[MCQForGradingItemSchema]
