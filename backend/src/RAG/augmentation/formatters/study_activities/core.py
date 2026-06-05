from typing import Any, Callable, Iterable

from backend.src.models_schema.activity.exercise_item import ExerciseItem
from backend.src.models_schema.activity.review_item import ReviewItem
from backend.src.models_schema.activity.study_activity import StudyActivity
from backend.src.models_schema.miscellaneous.enums import (
    ReviewItemContentType,
    StudyActivityFormat,
)


def MCQ_item_formatter(item: ExerciseItem) -> str:
    return f"""Question: {item.question}
Choices:
{"\n".join(item_content.content for item_content in item.contents)}
Student answer was: {"Correct" if item.user_score > 0 else "Wrong"}
LLM grader's assessment: {item.explanation}
"""


def open_ended_item_formatter(item: ExerciseItem) -> str:
    return f"""Question: {item.question}
Student answer: {item.attempt}
Student score (graded by the LLM grader): {item.user_score} out of {item.max_score}
LLM grader's assessment: {item.explanation}
"""


def flashcard_item_formatter(item: ReviewItem) -> str:
    return f"""
Flashcard front content: {[item_content.content for item_content in item.contents if item_content.type == ReviewItemContentType.FLASHCARDS_FRONT][0]}
Flashcard back content: {[item_content.content for item_content in item.contents if item_content.type == ReviewItemContentType.FLASHCARDS_BACK][0]}
"""


def gap_fill_item_formatter(item: ReviewItem) -> str:
    return f"""
Gap fill blank-filled text: {[item_content.content for item_content in item.contents if item_content.type == ReviewItemContentType.GAP_FILL_TEXT][0]}
Gap fill correct answers (in the correct order based on the black-filled text): {" - ".join([item_content.content for item_content in item.contents if item_content.type == ReviewItemContentType.GAP_FILL_CORRECT])}
Gap fill incorrect answers (surplus distractors): {", ".join([item_content.content for item_content in item.contents if item_content.type == ReviewItemContentType.GAP_FILL_DISTRACTOR])} 
"""


def singular_study_activity_formatter(index: int, study_activity: StudyActivity) -> str:
    formatter_map: dict[StudyActivityFormat, Callable[[Any], str]] = {
        StudyActivityFormat.MULTIPLE_CHOICE_QUESTIONS: MCQ_item_formatter,
        StudyActivityFormat.OPEN_ENDED: open_ended_item_formatter,
        StudyActivityFormat.FLASHCARDS: flashcard_item_formatter,
        StudyActivityFormat.GAP_FILL: gap_fill_item_formatter,
    }

    return f"""Study activity #{index}:
Study activity format: {study_activity.activity_format}
Study activity subject type: {study_activity.subject_type}
Study activity contents:
{"\n".join(formatter_map[study_activity.activity_format](item) for item in study_activity.items)} # type: ignore
"""


def study_activities_formatter(study_activities: Iterable[StudyActivity]) -> str:
    formatted_study_activities = "\n\n".join(
        singular_study_activity_formatter(i, act)
        for i, act in enumerate(study_activities, start=1)
    )

    return formatted_study_activities
