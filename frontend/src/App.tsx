import React, { useState, useEffect } from 'react';
import './App.css';

interface MoodResponse {
  mood: string;
  confidence: number;
  emotion_scores?: Record<string, number>;
}

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  excited: '🤩',
  loving: '❤️',
  surprised: '😲',
  neutral: '😐',
  positive: '🙂',
  negative: '🙁',
  sad: '😔',
  angry: '😠',
  anxious: '😰',
  disgusted: '🤢',
  peaceful: '😌',
  exhausted: '😴'
};

const MOOD_GRADIENTS: Record<string, string> = {
  happy: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  excited: 'linear-gradient(135deg, #FF8008 0%, #FFC837 100%)',
  loving: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
  surprised: 'linear-gradient(135deg, #A770EF 0%, #FDB99B 100%)',
  neutral: 'linear-gradient(135deg, #74ebd5 0%, #9face6 100%)',
  positive: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
  negative: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
  sad: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)',
  angry: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)',
  anxious: 'linear-gradient(135deg, #5614B0 0%, #DBD65C 100%)',
  disgusted: 'linear-gradient(135deg, #4DA0B0 0%, #D39D38 100%)',
  peaceful: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  exhausted: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)'
};

function App() {
  const [text, setText] = useState('');
  const [moodData, setMoodData] = useState<MoodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'result'>(moodData ? 'result' : 'input');
  const [typingEffect, setTypingEffect] = useState<string | null>(null);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Examples to show in the placeholder
  const examples = [
    "I'm feeling so happy today! Everything is going great!",
    "I'm really stressed about this deadline coming up.",
    "I'm just feeling kind of neutral today, nothing special.",
    "That movie made me so angry, I can't believe the ending!",
    "I feel so peaceful after that meditation session."
  ];
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(examples[0]);

  // Cycle through examples for the placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prevIndex) => (prevIndex + 1) % examples.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [examples.length]);

  // Update placeholder text with animation
  useEffect(() => {
    setTypingEffect(examples[currentExampleIndex]);
    setCurrentTypingIndex(0);
  }, [currentExampleIndex]);

  // Typing effect for placeholder
  useEffect(() => {
    if (typingEffect === null) return;
    
    if (currentTypingIndex < typingEffect.length) {
      const timeout = setTimeout(() => {
        setPlaceholderText(typingEffect.substring(0, currentTypingIndex + 1));
        setCurrentTypingIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentTypingIndex, typingEffect]);

  // Switch tabs with animation
  const switchTab = (tab: 'input' | 'result') => {
    if (activeTab !== tab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tab);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
    }
  };

  const analyzeMood = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
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
      switchTab('result');
    } catch (err) {
      setError('Failed to connect to the mood analysis service. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    switchTab('input');
    setText('');
    // Keep the moodData to allow toggling back to results
  };

  // Get the top 3 emotions from the emotion scores
  const getTopEmotions = () => {
    if (!moodData?.emotion_scores) return [];
    
    return Object.entries(moodData.emotion_scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  // Handle keydown event for textarea
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      analyzeMood();
    }
  };

  return (
    <div 
      className="app-container"
      style={{
        background: moodData 
          ? MOOD_GRADIENTS[moodData.mood] || 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)'
          : 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)'
      }}
    >
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">
            <span className="emoji-title">🧠</span> Mood Detector
          </h1>
          <p className="app-subtitle">
            Analyze your emotions with advanced AI
          </p>
        </header>

        <div className="tab-container">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'input' ? 'active' : ''}`} 
              onClick={() => switchTab('input')}
            >
              Input
            </button>
            <button 
              className={`tab-button ${activeTab === 'result' ? 'active' : ''}`} 
              onClick={() => switchTab('result')}
              disabled={!moodData}
            >
              Results
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'input' ? (
              <div className={`input-panel ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                <div className="text-input-container">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholderText}
                    rows={6}
                    className="text-input"
                    onKeyDown={handleKeyDown}
                  />
                  <div className="word-count">{text.trim().split(/\s+/).filter(Boolean).length} words</div>
                  <p className="input-tip">Tip: Press Ctrl+Enter to analyze</p>
                </div>
                
                <button
                  onClick={analyzeMood}
                  disabled={loading}
                  className="analyze-button"
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      <span className="button-text">Analyze Mood</span>
                      <span className="button-icon">✨</span>
                    </>
                  )}
                </button>
                
                {error && <div className="error-message">{error}</div>}
              </div>
            ) : (
              <div className={`result-panel ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                {moodData ? (
                  <>
                    <div className="mood-result">
                      <div className="mood-emoji">{MOOD_EMOJIS[moodData.mood] || '😶'}</div>
                      <h2 className="mood-title">
                        {moodData.mood.charAt(0).toUpperCase() + moodData.mood.slice(1)}
                      </h2>
                      <div className="confidence-container">
                        <p className="confidence-label">Confidence: {Math.round(moodData.confidence * 100)}%</p>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-level" 
                            style={{ width: `${moodData.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {moodData.emotion_scores && (
                      <div className="emotions-container">
                        <h3 className="emotions-title">Top Emotions</h3>
                        <div className="emotions-grid">
                          {getTopEmotions().map(([emotion, score]) => (
                            <div key={emotion} className="emotion-card">
                              <div className="emotion-name">
                                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                              </div>
                              <div className="emotion-bar-container">
                                <div 
                                  className="emotion-bar" 
                                  style={{ width: `${score * 100}%` }}
                                ></div>
                              </div>
                              <div className="emotion-score">{Math.round(score * 100)}%</div>
                            </div>
                          ))}
                        </div>

                        <div className="full-emotions-breakdown">
                          <h4 className="breakdown-title">Full Emotion Breakdown</h4>
                          <div className="breakdown-grid">
                            {Object.entries(moodData.emotion_scores)
                              .sort(([, a], [, b]) => b - a)
                              .map(([emotion, score]) => (
                                <div key={emotion} className="breakdown-item">
                                  <span className="breakdown-name">{emotion}</span>
                                  <div className="breakdown-bar-container">
                                    <div 
                                      className="breakdown-bar" 
                                      style={{ width: `${score * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="breakdown-score">{Math.round(score * 100)}%</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="analyzed-text">
                      <h3 className="analyzed-text-title">Analyzed Text</h3>
                      <div className="text-content">{text}</div>
                    </div>

                    <button onClick={resetAnalysis} className="new-analysis-button">
                      <span className="button-text">New Analysis</span>
                      <span className="button-icon">↻</span>
                    </button>
                  </>
                ) : (
                  <div className="no-results">
                    <p>No mood analysis results yet.</p>
                    <button onClick={() => switchTab('input')} className="go-to-input-button">
                      Go to Input
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="app-footer">
          <p>
            Mood Detector using advanced emotion analysis AI
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
