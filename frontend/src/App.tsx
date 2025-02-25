import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Auth } from './components/Auth';
import QuizComponent from './components/Quiz';
import { quizzes } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchQuizzes();
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    fetchQuizzes();
  };

  const fetchQuizzes = async () => {
    try {
      const data = await quizzes.getAll();
      setAvailableQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (selectedQuizId) {
    return (
      <QuizComponent
        quizId={selectedQuizId}
        onComplete={() => setSelectedQuizId(null)}
      />
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Quizzes
        </Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {availableQuizzes.map((quiz) => (
            <Box
              key={quiz.id}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => setSelectedQuizId(quiz.id)}
            >
              <Typography variant="h6">{quiz.title}</Typography>
              <Typography color="text.secondary">
                Category: {quiz.category}
              </Typography>
              <Typography variant="body2">{quiz.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default App;