from backend.src.models_schema.activity.exercise_item import ExerciseItem


def open_ended_item_formatter(item: ExerciseItem) -> str:
    return f"""Question: {item.question}
Student answer: {item.attempt}
Student score (graded by the LLM grader): {item.user_score} out of {item.max_score}
LLM grader's assessment: {item.explanation}
"""