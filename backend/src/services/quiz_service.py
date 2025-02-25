from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.database import (
    Quiz,
    Question,
    Answer,
    UserResponse,
    Result,
    QuestionType,
    QuizDifficulty,
)
from datetime import datetime
import uuid


class QuizService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_quizzes(self) -> List[Quiz]:
        return self.db.query(Quiz).all()

    def get_quiz_by_id(self, quiz_id: uuid.UUID) -> Optional[Quiz]:
        return self.db.query(Quiz).filter(Quiz.id == quiz_id).first()

    def create_quiz(
        self,
        title: str,
        description: str,
        category: str,
        difficulty: QuizDifficulty,
        created_by: uuid.UUID,
    ) -> Quiz:
        quiz = Quiz(
            title=title,
            description=description,
            category=category,
            difficulty=difficulty,
            created_by=created_by,
        )
        self.db.add(quiz)
        self.db.commit()
        self.db.refresh(quiz)
        return quiz

    def add_question(
        self,
        quiz_id: uuid.UUID,
        question_text: str,
        question_type: QuestionType,
        answers: List[dict],
    ) -> Question:
        question = Question(
            quiz_id=quiz_id, question_text=question_text, question_type=question_type
        )
        self.db.add(question)
        self.db.flush()  # Get the question ID

        for answer_data in answers:
            answer = Answer(
                question_id=question.id,
                answer_text=answer_data["text"],
                is_correct=answer_data["is_correct"],
            )
            self.db.add(answer)

        self.db.commit()
        self.db.refresh(question)
        return question

    def submit_answer(
        self,
        user_id: uuid.UUID,
        quiz_id: uuid.UUID,
        question_id: uuid.UUID,
        answer_id: uuid.UUID,
    ) -> bool:
        # Record the user's response
        response = UserResponse(
            user_id=user_id,
            quiz_id=quiz_id,
            question_id=question_id,
            selected_answer_id=answer_id,
        )
        self.db.add(response)
        self.db.commit()

        # Check if answer is correct
        answer = self.db.query(Answer).filter(Answer.id == answer_id).first()
        return answer.is_correct if answer else False

    def complete_quiz(self, user_id: uuid.UUID, quiz_id: uuid.UUID) -> Result:
        # Get all user responses for this quiz
        responses = (
            self.db.query(UserResponse)
            .filter(UserResponse.user_id == user_id, UserResponse.quiz_id == quiz_id)
            .all()
        )

        # Count correct answers
        correct_answers = sum(
            1 for response in responses if response.selected_answer.is_correct
        )

        # Get total questions
        total_questions = (
            self.db.query(Question).filter(Question.quiz_id == quiz_id).count()
        )

        # Create result
        result = Result(
            user_id=user_id,
            quiz_id=quiz_id,
            score=int((correct_answers / total_questions) * 100),
            total_questions=total_questions,
            correct_answers=correct_answers,
        )
        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)
        return result
