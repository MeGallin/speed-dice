import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion } from 'framer-motion';
import {
  specialRollAtom,
  playerCountAtom,
  currentPlayerAtom,
} from './DiceRoller';
import { getNextPlayer } from '../utils/diceLogic';
import { doubleTroubleAtom } from './GameSettings';

const PlayerManager = () => {
  // Global state
  const [playerCount, setPlayerCount] = useAtom(playerCountAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [specialRoll] = useAtom(specialRollAtom);
  const [doubleTrouble] = useAtom(doubleTroubleAtom);

  // Local state
  const [isAnimating, setIsAnimating] = useState(false);

  // Player colors for visual distinction
  const playerColors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  // Handle next player button click
  const handleNextPlayer = () => {
    setIsAnimating(true);

    // Short delay for animation
    setTimeout(() => {
      // Only consider doubles for next player logic if doubleTrouble is enabled
      const effectiveSpecialRoll = doubleTrouble ? specialRoll : null;
      const nextPlayer = getNextPlayer(
        currentPlayer,
        playerCount,
        effectiveSpecialRoll,
      );
      setCurrentPlayer(nextPlayer);
      setIsAnimating(false);
    }, 300);
  };

  // Handle player count change
  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setPlayerCount(count);

    // Reset current player if needed
    if (currentPlayer >= count) {
      setCurrentPlayer(0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Player Management</h2>

      {/* Player Count Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Number of Players:
        </label>
        <select
          value={playerCount}
          onChange={handlePlayerCountChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {[2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} Players
            </option>
          ))}
        </select>
      </div>

      {/* Current Player Display */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Current Player:
        </label>
        <motion.div
          className={`p-3 rounded-md text-white text-center font-bold ${playerColors[currentPlayer]}`}
          animate={{
            scale: isAnimating ? [1, 1.05, 1] : 1,
            opacity: isAnimating ? [1, 0.7, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          Player {currentPlayer + 1}
        </motion.div>
      </div>

      {/* Player Tokens Display */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: playerCount }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-8 h-8 rounded-full ${
              index === currentPlayer ? playerColors[index] : 'bg-gray-200'
            }`}
            animate={{
              scale: index === currentPlayer ? 1.2 : 1,
              y: index === currentPlayer ? -5 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
        ))}
      </div>

      {/* Next Player Button */}
      <button
        onClick={handleNextPlayer}
        disabled={isAnimating}
        className={`w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
          specialRoll === 'double' && doubleTrouble
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
      >
        {specialRoll === 'double' && doubleTrouble
          ? 'Roll Again (Double)'
          : 'Next Player'}
      </button>

      {/* Special Roll Instruction */}
      {specialRoll === 'double' && doubleTrouble && (
        <p className="text-sm text-center mt-2 text-yellow-600">
          You rolled a double! Roll again.
        </p>
      )}
    </div>
  );
};

export default PlayerManager;
