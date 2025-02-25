import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, Paper, Container } from '@mui/material';
import { quizzes, Quiz, Question } from '../services/api';

interface QuizComponentProps {
  quizId: string;
  onComplete?: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzes.getById(quizId);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load quiz');
        console.error('Error fetching quiz:', err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerSubmit = async () => {
    if (quiz && selectedChoice) {
      try {
        const currentQuestionData = quiz.questions[currentQuestion];
        const response = await quizzes.submitAnswer(
          quiz.id,
          currentQuestionData.id,
          selectedChoice
        );

        if (response.correct) {
          setScore(score + 1);
        }

        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedChoice(null);
        } else {
          const result = await quizzes.completeQuiz(quiz.id);
          setShowResults(true);
          onComplete?.();
        }
      } catch (err) {
        setError('Failed to submit answer');
        console.error('Error submitting answer:', err);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setScore(0);
    setShowResults(false);
    setError(null);
  };

  if (error) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography color="error">{error}</Typography>
          <Button onClick={handleRetry} variant="contained" sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography>Loading quiz...</Typography>
        </Paper>
      </Container>
    );
  }

  if (showResults) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>Quiz Results</Typography>
          <Typography variant="h5">
            Your score: {score} out of {quiz.questions.length}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Percentage: {((score / quiz.questions.length) * 100).toFixed(2)}%
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            sx={{ mt: 3 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {currentQuestionData.question_text}
          </Typography>
        </Box>

        <RadioGroup
          value={selectedChoice}
          onChange={(e) => setSelectedChoice(e.target.value)}
        >
          {currentQuestionData.answers.map((answer) => (
            <FormControlLabel
              key={answer.id}
              value={answer.id}
              control={<Radio />}
              label={answer.answer_text}
              sx={{ mb: 1 }}
            />
          ))}
        </RadioGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAnswerSubmit}
          disabled={!selectedChoice}
          sx={{ mt: 3 }}
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Paper>
    </Container>
  );
};

export default QuizComponent;