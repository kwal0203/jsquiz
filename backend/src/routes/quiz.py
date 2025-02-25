from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from ..models.database import Quiz, Question, Answer, QuestionType, QuizDifficulty, User
from ..services.quiz_service import QuizService
from ..config.database import get_db
from .auth import get_current_user_dependency
from pydantic import BaseModel
import uuid

router = APIRouter()


# Pydantic models for request/response
class AnswerCreate(BaseModel):
    text: str
    is_correct: bool


class QuestionCreate(BaseModel):
    question_text: str
    question_type: QuestionType
    answers: List[AnswerCreate]


class QuizCreate(BaseModel):
    title: str
    description: str
    category: str
    difficulty: QuizDifficulty


@router.get("/quizzes", response_model=List[Quiz])
async def get_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency),
):
    quiz_service = QuizService(db)
    return quiz_service.get_all_quizzes()


@router.get("/quizzes/{quiz_id}")
async def get_quiz(
    quiz_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency),
):
    quiz_service = QuizService(db)
    quiz = quiz_service.get_quiz_by_id(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@router.post("/quizzes")
async def create_quiz(
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency),
):
    quiz_service = QuizService(db)
    return quiz_service.create_quiz(
        title=quiz_data.title,
        description=quiz_data.description,
        category=quiz_data.category,
        difficulty=quiz_data.difficulty,
        created_by=current_user.id,
    )


@router.post("/quizzes/{quiz_id}/questions")
async def add_question(
    quiz_id: uuid.UUID,
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency),
):
    quiz_service = QuizService(db)
    quiz = quiz_service.get_quiz_by_id(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    if quiz.created_by != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this quiz"
        )

    return quiz_service.add_question(
        quiz_id=quiz_id,
        question_text=question_data.question_text,
        question_type=question_data.question_type,
        answers=[
            {"text": a.text, "is_correct": a.is_correct} for a in question_data.answers
        ],
    )


@router.post("/quizzes/{quiz_id}/submit")
async def submit_answer(
    quiz_id: uuid.UUID,
    question_id: uuid.UUID,
    answer_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency),
):
    quiz_service = QuizService(db)
    is_correct = quiz_service.submit_answer(
        user_id=current_user.id,
        quiz_id=quiz_id,
        question_id=question_id,
        answer_id=answer_id,
    )
    return {"correct": is_correct}


@router.post("/quizzes/{quiz_id}/complete")
async def complete_quiz(
    quiz_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency),
):
    quiz_service = QuizService(db)
    result = quiz_service.complete_quiz(user_id=current_user.id, quiz_id=quiz_id)
    return result
