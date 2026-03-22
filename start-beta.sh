#!/bin/bash

# KerfOS Quick Start Script for Beta Testing
# Run this to start both backend and frontend

echo "🚀 Starting KerfOS Beta..."

# Check if we're in the right directory
if [ ! -f "backend/main.py" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the KerfOS root directory"
    exit 1
fi

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: No .env file found in backend/"
    echo "   Creating template .env file..."
    cat > backend/.env << EOF
DATABASE_URL=postgresql://localhost/kerfos
SECRET_KEY=$(openssl rand -hex 32)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
EOF
    echo "✅ Created backend/.env - Please update with your keys"
fi

# Start backend
echo "📦 Starting backend..."
cd backend

# Check for virtual environment
if [ ! -d "venv" ]; then
    echo "   Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
pip install -q -r requirements.txt

# Check database
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL first."
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql"
fi

# Start backend server
echo "   Starting FastAPI server on http://localhost:8000..."
uvicorn main:app --reload &
BACKEND_PID=$!

cd ..

# Start frontend
echo "🎨 Starting frontend..."
cd frontend

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi

# Start frontend server
echo "   Starting Next.js server on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ KerfOS is running!"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT

# Keep script running
wait
