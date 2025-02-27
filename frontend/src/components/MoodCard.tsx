import React from 'react';
import { motion } from 'framer-motion';

interface MoodResponse {
  mood: string;
  confidence: number;
  emotion_scores?: Record<string, number>;
}

interface MoodCardProps {
  moodData: MoodResponse;
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

const MoodCard: React.FC<MoodCardProps> = ({ moodData }) => {
  const { mood, confidence, emotion_scores } = moodData;
  
  // Ensure the mood exists in our emoji list, otherwise use neutral as fallback
  const emoji = MOOD_EMOJIS[mood.toLowerCase()] || MOOD_EMOJIS.neutral;
  const gradient = MOOD_GRADIENTS[mood.toLowerCase()] || MOOD_GRADIENTS.neutral;
  
  // Format confidence as percentage
  const confidencePercent = Math.round(confidence * 100);
  
  return (
    <motion.div
      className="bg-white/90 dark:bg-dark-DEFAULT/90 rounded-xl shadow-lg overflow-hidden backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div 
        className="p-6 flex flex-col md:flex-row items-center"
        style={{ background: gradient }}
      >
        <motion.div 
          className="text-6xl md:text-8xl mb-4 md:mb-0 md:mr-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {emoji}
        </motion.div>
        
        <div className="text-center md:text-left text-white">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </motion.h2>
          
          <motion.div
            className="w-full bg-white/30 rounded-full h-4 mb-2"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div 
              className="bg-white h-4 rounded-full" 
              style={{ width: `${confidencePercent}%` }}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Confidence: {confidencePercent}%
          </motion.p>
        </div>
      </div>
      
      {emotion_scores && (
        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h3 className="text-lg font-bold mb-4 dark:text-light-light">Emotion Distribution</h3>
          <div className="space-y-4">
            {Object.entries(emotion_scores)
              .sort(([, a], [, b]) => b - a)
              .map(([emotion, score], index) => (
                <div key={emotion} className="space-y-1">
                  <div className="flex justify-between text-sm text-dark-DEFAULT dark:text-light-DEFAULT">
                    <span>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                    <span>{Math.round(score * 100)}%</span>
                  </div>
                  <motion.div
                    className="w-full bg-light-DEFAULT dark:bg-dark-light rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <div 
                      className="bg-primary-DEFAULT dark:bg-primary-light h-2 rounded-full" 
                      style={{ width: `${Math.round(score * 100)}%` }}
                    />
                  </motion.div>
                </div>
              ))
            }
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MoodCard; 