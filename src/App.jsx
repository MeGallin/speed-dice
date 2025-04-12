import { useState } from 'react';
import './App.css';
import './styles/BoardGameTheme.css';
import DiceRoller from './components/DiceRoller';
import GameSettings from './components/GameSettings';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="app board-game-bg">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6 text-white drop-shadow-lg">
          Speed Dice
        </h1>

        {/* Toggle Button */}
        <div className="flex justify-center mb-4">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showSettings
              ? 'Hide Settings & History'
              : 'Show Settings & History'}
          </motion.button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="game-card">
                <GameSettings />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dice Roller (always visible) */}
        <div className="game-card">
          <DiceRoller />
        </div>
      </div>
    </div>
  );
}

export default App;
