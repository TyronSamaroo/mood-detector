import React, { useState } from 'react';
import './App.css';

interface MoodResponse {
  mood: string;
  confidence: number;
}

function App() {
  const [text, setText] = useState('');
  const [moodData, setMoodData] = useState<MoodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMood = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }

      const data = await response.json();
      setMoodData(data);
    } catch (err) {
      setError('Failed to analyze mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'very happy':
      case 'happy':
      case 'excited':
        return '#4CAF50'; // Green
      case 'neutral':
        return '#2196F3'; // Blue
      case 'sad':
      case 'very sad':
        return '#9C27B0'; // Purple
      case 'angry':
        return '#F44336'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Advanced Mood Detector</h1>
        <div className="input-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            rows={4}
            className="text-input"
          />
          <button
            onClick={analyzeMood}
            disabled={loading}
            className="analyze-button"
          >
            {loading ? 'Analyzing...' : 'Analyze Mood'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {moodData && (
          <div className="result-container">
            <h2 style={{ color: getMoodColor(moodData.mood) }}>
              Detected mood: {moodData.mood}
            </h2>
            <div className="confidence-bar">
              <div 
                className="confidence-level" 
                style={{ 
                  width: `${moodData.confidence * 100}%`,
                  backgroundColor: getMoodColor(moodData.mood)
                }}
              ></div>
            </div>
            <p>Confidence: {Math.round(moodData.confidence * 100)}%</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
