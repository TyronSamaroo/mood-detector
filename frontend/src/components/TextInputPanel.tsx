import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SpinnerIcon, PaperPlaneIcon } from '../utils/IconWrappers';

interface TextInputPanelProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
  error: string | null;
}

const TextInputPanel: React.FC<TextInputPanelProps> = ({ 
  onAnalyze, 
  loading, 
  error 
}) => {
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  
  // Examples to show in the placeholder - wrapped in useMemo to fix hook dependency issue
  const examples = useMemo(() => [
    "I'm feeling so happy today! Everything is going great!",
    "I'm really stressed about this deadline coming up.",
    "I'm just feeling kind of neutral today, nothing special.",
    "That movie made me so angry, I can't believe the ending!",
    "I feel so peaceful after that meditation session."
  ], []);

  // Cycle through examples for the placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prevIndex) => (prevIndex + 1) % examples.length);
      setCurrentTypingIndex(0);
      setPlaceholder('');
    }, 8000);
    return () => clearInterval(interval);
  }, [examples.length]);

  // Typing effect for placeholder
  useEffect(() => {
    if (currentTypingIndex < examples[currentExampleIndex].length) {
      const timeout = setTimeout(() => {
        setPlaceholder(examples[currentExampleIndex].substring(0, currentTypingIndex + 1));
        setCurrentTypingIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentTypingIndex, currentExampleIndex, examples]);

  // Handle key press for submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAnalyze(text);
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/90 dark:bg-dark-DEFAULT/90 backdrop-blur-md rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-light-light">
          How are you feeling today?
        </h2>
        
        <div className="relative mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            rows={5}
            className="w-full p-4 border border-gray-300 dark:border-dark-light rounded-lg 
                       focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent
                       bg-white/70 dark:bg-dark-light/70 dark:text-light-light text-dark-dark
                       transition-all duration-300 outline-none resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">
            {text.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-light rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-light rounded text-xs">Enter</kbd> to analyze
          </p>
          
          <motion.button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className={`px-4 py-2 rounded-lg flex items-center ${
              !text.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-DEFAULT hover:bg-primary-dark'
            } text-white transition-colors duration-300`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <SpinnerIcon className="animate-spin mr-2" />
            ) : (
              <PaperPlaneIcon className="mr-2" />
            )}
            Analyze Mood
          </motion.button>
        </div>
        
        {error && (
          <motion.div 
            className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TextInputPanel; 