# Autonomous AI Data Analyst

An AI-powered full-stack web application that allows users to upload datasets and interact with them using natural language.

## Features

- **Authentication**: JWT-based login/signup.
- **Data Upload**: Drag-and-drop CSV/Excel files.
- **AI Chat**: Natural language queries on your dataset powered by Gemini 1.5 Pro.
- **Auto Visualization**: Generates charts (bar, line, pie) based on data insights.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, ShadCN UI, Zustand, Recharts
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, LangChain, Google GenAI
- **Infrastructure**: Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js (for running frontend locally without Docker)
- Python 3.10+ (for running backend locally without Docker)

### Setup Instructions

1. **Environment Variables**:
   In `backend/.env`, set your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

2. **Run Services with Docker**:
   To start the PostgreSQL database and Redis:
   ```bash
   docker-compose up -d
   ```

3. **Run Backend**:
   Navigate to the `backend` directory, create a virtual environment, and run:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

4. **Run Frontend**:
   Navigate to the `frontend` directory and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access Application**:
   Open `http://localhost:3000` in your browser.
