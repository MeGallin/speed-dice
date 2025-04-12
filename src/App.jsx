import { useState } from 'react';
import './App.css';
import './styles/BoardGameTheme.css';
import DiceRoller, { gameStartedAtom } from './components/DiceRoller';
import GameSettings from './components/GameSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { rollHistoryAtom } from './components/GameHistory';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useAtom(gameStartedAtom);
  const [, setRollHistory] = useAtom(rollHistoryAtom);

  // Reset the game state
  const resetGame = () => {
    // This will be passed to DiceRoller component
    if (
      window.confirm(
        'Are you sure you want to reset the game? This will clear all progress.',
      )
    ) {
      // Reset game state in App component
      setGameStarted(false);
      setRollHistory([]);

      // Force a re-render by updating a state
      setShowSettings(false);

      console.log('Game reset initiated from App component');
    }
  };

  return (
    <div className="app board-game-bg">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-center my-6">
          <h1 className="speed-dice-header">SPEED DICE</h1>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-4">
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

          {gameStarted && (
            <motion.button
              onClick={resetGame}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Game
            </motion.button>
          )}
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
          <DiceRoller onResetGame={resetGame} />
        </div>
      </div>
    </div>
  );
}

export default App;
