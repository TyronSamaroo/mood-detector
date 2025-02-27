import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Background3D from './components/Background3D';
import TextInputPanel from './components/TextInputPanel';
import MoodCard from './components/MoodCard';
import { ArrowLeftIcon, GithubIcon } from './utils/IconWrappers';

interface MoodResponse {
  mood: string;
  confidence: number;
  emotion_scores?: Record<string, number>;
}

function App() {
  const [text, setText] = useState('');
  const [moodData, setMoodData] = useState<MoodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const analyzeMood = async (inputText: string) => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setText(inputText);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }

      const data = await response.json();
      setMoodData(data);
      setShowResults(true);
    } catch (err) {
      setError('Failed to connect to the mood analysis service. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setShowResults(false);
  };

  return (
    <ThemeProvider>
      {/* 3D animated background */}
      <Background3D />
      
      {/* Theme toggle button */}
      <ThemeToggle />
      
      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-light-light/50 to-light-DEFAULT/50 dark:from-dark-DEFAULT/50 dark:to-dark-dark/50">
        <motion.header 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-DEFAULT to-secondary-DEFAULT animate-gradient-x bg-size-200"
          >
            Mood Detector
          </motion.h1>
          <p className="text-lg text-dark-DEFAULT dark:text-light-DEFAULT">
            Analyze your emotions with advanced AI
          </p>
        </motion.header>
        
        <main className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {showResults && moodData ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex items-center mb-6">
                  <motion.button
                    onClick={resetAnalysis}
                    className="flex items-center text-primary-DEFAULT hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-DEFAULT transition-colors"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeftIcon className="mr-2" />
                    Back to Input
                  </motion.button>
                </div>
                
                <MoodCard moodData={moodData} />
                
                <div className="mt-6 bg-white/90 dark:bg-dark-DEFAULT/90 backdrop-blur-md rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-3 dark:text-light-light">Your Input</h3>
                  <p className="text-dark-DEFAULT dark:text-light-DEFAULT bg-light-light dark:bg-dark-light p-4 rounded-lg italic">
                    "{text}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <TextInputPanel 
                  onAnalyze={analyzeMood} 
                  loading={loading} 
                  error={error} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <footer className="mt-8 text-center text-sm text-dark-DEFAULT/70 dark:text-light-DEFAULT/70">
          <p>© {new Date().getFullYear()} Mood Detector</p>
          <div className="flex justify-center mt-2">
            <a 
              href="https://github.com/yourusername/mood-detector" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-DEFAULT hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-DEFAULT flex items-center"
            >
              <GithubIcon className="mr-1" /> View on GitHub
            </a>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
