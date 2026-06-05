from backend.src.models_schema.activity.exercise_item import ExerciseItem


def MCQ_item_formatter(item: ExerciseItem) -> str:
    return f"""Question: {item.question}
Choices:
{"\n".join(item_content.content for item_content in item.contents)}
Student answer was: {"Correct" if item.user_score > 0 else "Wrong"}
LLM grader's assessment: {item.explanation}
"""
