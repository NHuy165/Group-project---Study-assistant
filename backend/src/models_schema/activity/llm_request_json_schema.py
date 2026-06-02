from sqlmodel import SQLModel

# ----- GRADING SCHEMAS ----- #

# === Open ended === #


class OpenEndedGradingInitiationItemSchema(SQLModel):
    id: int
    max_score: float
    question: str
    attempt: str | None


class OpenEndedGradingInitiationSchema(SQLModel):
    questions_answers: list[OpenEndedGradingInitiationItemSchema]
