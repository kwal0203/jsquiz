import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, Paper, Container } from '@mui/material';

interface Choice {
  text: string;
  is_correct: boolean;
}

interface Question {
  question: string;
  choices: Choice[];
  category: string;
}

interface Quiz {
  title: string;
  description: string;
  category: string;
  questions: Question[];
  created_by: string;
  created_at: string;
}

const QuizComponent: React.FC<{ quizTitle: string }> = ({ quizTitle }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizTitle}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [quizTitle]);

  const handleAnswerSubmit = async () => {
    if (quiz && selectedChoice !== -1) {
      try {
        const response = await axios.post(
          `/api/quizzes/validate/${quiz.title}/${currentQuestion}/${selectedChoice}`
        );

        if (response.data.correct) {
          setScore(score + 1);
        }

        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedChoice(-1);
        } else {
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error validating answer:', error);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedChoice(-1);
    setScore(0);
    setShowResults(false);
  };

  if (!quiz) {
    return <Typography>Loading quiz...</Typography>;
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
            {currentQuestionData.question}
          </Typography>
        </Box>

        <RadioGroup
          value={selectedChoice}
          onChange={(e) => setSelectedChoice(parseInt(e.target.value))}
        >
          {currentQuestionData.choices.map((choice, index) => (
            <FormControlLabel
              key={index}
              value={index}
              control={<Radio />}
              label={choice.text}
              sx={{ mb: 1 }}
            />
          ))}
        </RadioGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAnswerSubmit}
          disabled={selectedChoice === -1}
          sx={{ mt: 3 }}
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Paper>
    </Container>
  );
};

export default QuizComponent;