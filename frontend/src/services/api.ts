import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const auth = {
  login: async (data: LoginData) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    const response = await api.post('/token', formData);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question_text: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  answer_text: string;
}

export const quizzes = {
  getAll: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  submitAnswer: async (quizId: string, questionId: string, answerId: string) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, {
      question_id: questionId,
      answer_id: answerId,
    });
    return response.data;
  },

  completeQuiz: async (quizId: string) => {
    const response = await api.post(`/quizzes/${quizId}/complete`);
    return response.data;
  },
};