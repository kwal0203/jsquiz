from pydantic import BaseModel
from typing import List


class Choice(BaseModel):
    text: str
    is_correct: bool


class Question(BaseModel):
    question: str
    choices: List[Choice]
    category: str


class Quiz(BaseModel):
    title: str
    description: str
    category: str
    questions: List[Question]
    created_by: str
    created_at: str
