# QuizMaster

A modern quiz application built with FastAPI and React.

## Project Structure

The project is organized into two main parts:
- `backend/`: FastAPI backend
- `frontend/`: React frontend

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   uvicorn src.main:app --reload
   ```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at http://localhost:3000

## Features

- Modern, responsive UI built with Material-UI
- Real-time score tracking
- Multiple choice questions
- Quiz categories
- Score history
- User authentication (coming soon)

## Development

### Backend Development

The backend is built with FastAPI and includes:
- RESTful API endpoints
- Pydantic models for data validation
- Quiz service for business logic
- SQLAlchemy for database operations (coming soon)

### Frontend Development

The frontend is built with React and includes:
- TypeScript for type safety
- Material-UI for components
- Axios for API calls
- State management with React hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT