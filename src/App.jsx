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
    if (
      window.confirm(
        'Are you sure you want to reset the game? This will clear all progress.',
      )
    ) {
      setGameStarted(false);
      setRollHistory([]);
      setShowSettings(false);
      console.log('Game reset initiated from App component');
    }
  };

  return (
    <div className="app board-game-bg min-h-screen flex items-center justify-center">
      <div
        className="max-w-4xl w-full mx-auto p-4 flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 ">
          {/* Settings Panel */}
          <div className="flex justify-center sm:justify-end gap-4">
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
        </div>

        <div
          className="flex-grow flex flex-col relative overflow-y-auto"
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence mode="wait">
            {showSettings ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -50, rotate: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, rotate: 10, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full absolute inset-0"
                style={{ transformOrigin: 'center center' }}
              >
                <div className="h-full">
                  <GameSettings />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="diceroller"
                initial={{ opacity: 0, x: 50, rotate: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, rotate: -10, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full absolute inset-0"
                style={{ transformOrigin: 'center center' }}
              >
                <div className="game-card h-full">
                  <DiceRoller onResetGame={resetGame} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
