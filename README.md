# Mood Detector

This application analyzes text to detect the user's mood using natural language processing. It consists of a FastAPI backend and a React frontend.

## Features

- Advanced NLP-based mood detection using TextBlob
- Multiple mood categories: very happy, happy, excited, neutral, sad, very sad, and angry
- Visual confidence indicator
- Color-coded mood results
- API endpoint for integration with other applications

## Backend

The backend is built with FastAPI and uses TextBlob for sentiment analysis.

### Prerequisites

- Python 3.9+
- Poetry (for dependency management)

### Installation and Setup

1. Install dependencies using Poetry:

```bash
cd backend
poetry install
```

2. Run the backend:

```bash
cd backend
poetry run python run.py
```

The API will be available at http://localhost:8000.

## Frontend

The frontend is built with React and TypeScript.

### Prerequisites

- Node.js 14+ and npm

### Installation and Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
cd frontend
npm start
```

The web app will be available at http://localhost:3000.

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/mood`: Analyze text and return mood
  - Payload: `{ "text": "Your text here" }`
  - Response: `{ "text": "Your text here", "mood": "happy", "confidence": 0.75, "emotion_scores": {"joy": 4.5, "excitement": 2.1} }`

## Mood Categories

The application detects the following moods:

- Happy: Positive content, expressions of joy
- Excited: Enthusiastic and energetic content
- Loving: Expressions of affection and care
- Surprised: Unexpected or astonishing content
- Neutral: Content without strong emotional signals
- Sad: Negative content expressing sadness or disappointment
- Angry: Expressions of frustration or rage
- Anxious: Content expressing worry or fear
- Disgusted: Expressions of revulsion or distaste
- Peaceful: Content expressing calmness or tranquility
- Exhausted: Expressions of tiredness or fatigue

## How It Works

1. The frontend sends text to the backend
2. The backend analyzes the text using multiple techniques:
   - Keyword matching with weighted emotional keywords
   - Pattern recognition for emotional expressions
   - TextBlob sentiment analysis for polarity and subjectivity
3. Emotion scores are calculated for different emotional categories
4. The dominant emotion is identified and mapped to a mood
5. Confidence score is calculated based on emotion intensity and TextBlob subjectivity
6. The frontend displays the mood, confidence, and detailed emotion analysis

## License

MIT
