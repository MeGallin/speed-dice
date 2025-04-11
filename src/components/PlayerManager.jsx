import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion } from 'framer-motion';

// Function to get player icon based on index
const getPlayerIcon = (index) => {
  const icons = ['👑', '🚀', '🏆', '🎯', '🎮', '🎲'];
  return icons[index % icons.length];
};
import {
  specialRollAtom,
  playerCountAtom,
  currentPlayerAtom,
  hasRolledAtom,
  gameStartedAtom,
  diceValuesAtom,
} from './DiceRoller';
import { getNextPlayer } from '../utils/diceLogic';
import { doubleTroubleAtom } from './GameSettings';
import { rollHistoryAtom } from './GameHistory';

const PlayerManager = () => {
  // Global state
  const [playerCount, setPlayerCount] = useAtom(playerCountAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [specialRoll, setSpecialRoll] = useAtom(specialRollAtom);
  const [doubleTrouble] = useAtom(doubleTroubleAtom);
  const [hasRolled, setHasRolled] = useAtom(hasRolledAtom);
  const [gameStarted, setGameStarted] = useAtom(gameStartedAtom);
  const [, setDiceValues] = useAtom(diceValuesAtom);
  const [, setRollHistory] = useAtom(rollHistoryAtom);

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

  // Reset the game state
  const resetGame = () => {
    setGameStarted(false);
    setHasRolled(false);
    setCurrentPlayer(0);
    setSpecialRoll(null);
    setDiceValues([1, 1, 1]);
    setRollHistory([]);
  };

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

      // Reset the hasRolled state for the new player
      setHasRolled(false);

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
        <div className="relative">
          <select
            value={playerCount}
            onChange={handlePlayerCountChange}
            disabled={gameStarted}
            className={`w-full p-2 border rounded-md appearance-none ${
              gameStarted
                ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                : 'border-gray-300'
            }`}
          >
            {[2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} Players
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
          {gameStarted && (
            <p className="text-xs text-gray-500 mt-1">
              Player count cannot be changed after game has started
            </p>
          )}
        </div>
      </div>

      {/* Current Player Display with Avatar */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Current Player:
        </label>
        <div className="flex items-center gap-4">
          <motion.div
            className={`player-token w-16 h-16 text-2xl ${playerColors[currentPlayer]}`}
            animate={{
              scale: isAnimating ? [1, 1.1, 1] : [1, 1.05, 1],
              boxShadow: [
                '0 4px 8px rgba(0,0,0,0.2)',
                '0 8px 16px rgba(0,0,0,0.3)',
                '0 4px 8px rgba(0,0,0,0.2)',
              ],
            }}
            transition={{
              duration: isAnimating ? 0.3 : 2,
              repeat: isAnimating ? 0 : Infinity,
              repeatType: 'reverse',
            }}
          >
            {getPlayerIcon(currentPlayer)}
          </motion.div>
          <motion.div
            className={`flex-1 p-3 rounded-md text-white text-center font-bold ${playerColors[currentPlayer]}`}
            animate={{
              scale: isAnimating ? [1, 1.05, 1] : 1,
              opacity: isAnimating ? [1, 0.7, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            Player {currentPlayer + 1}
          </motion.div>
        </div>
      </div>

      {/* Player Tokens Display */}
      <div className="flex justify-center gap-3 mb-6 bg-gray-100 p-3 rounded-lg">
        <div className="text-sm font-medium text-gray-500 mr-2">Players:</div>
        {Array.from({ length: playerCount }).map((_, index) => (
          <motion.div
            key={index}
            className={`player-token ${
              index === currentPlayer ? playerColors[index] : 'bg-gray-300'
            }`}
            animate={{
              scale: index === currentPlayer ? 1.2 : 1,
              y: index === currentPlayer ? -5 : 0,
              boxShadow:
                index === currentPlayer
                  ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                  : '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {getPlayerIcon(index)}
          </motion.div>
        ))}
      </div>

      {/* Next Turn Button - More prominent */}
      <motion.button
        onClick={handleNextPlayer}
        disabled={
          isAnimating ||
          (!hasRolled && !(specialRoll === 'double' && doubleTrouble))
        }
        className={`w-full p-4 text-white rounded-lg font-bold text-lg transition-colors ${
          !hasRolled && !(specialRoll === 'double' && doubleTrouble)
            ? 'bg-gray-400 cursor-not-allowed'
            : specialRoll === 'double' && doubleTrouble
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-green-600 hover:bg-green-700'
        }`}
        whileHover={{
          scale:
            !hasRolled && !(specialRoll === 'double' && doubleTrouble)
              ? 1
              : 1.03,
        }}
        animate={{
          boxShadow:
            hasRolled && !(specialRoll === 'double' && doubleTrouble)
              ? [
                  '0 0 5px rgba(22, 163, 74, 0.3)',
                  '0 0 20px rgba(22, 163, 74, 0.6)',
                  '0 0 5px rgba(22, 163, 74, 0.3)',
                ]
              : '0 4px 6px rgba(0, 0, 0, 0.1)',
          y:
            hasRolled && !(specialRoll === 'double' && doubleTrouble)
              ? [0, -3, 0]
              : 0,
        }}
        transition={{
          y: {
            repeat:
              hasRolled && !(specialRoll === 'double' && doubleTrouble)
                ? Infinity
                : 0,
            duration: 1.5,
            repeatType: 'reverse',
          },
          boxShadow: {
            repeat:
              hasRolled && !(specialRoll === 'double' && doubleTrouble)
                ? Infinity
                : 0,
            duration: 1.5,
            repeatType: 'reverse',
          },
        }}
      >
        <div className="flex items-center justify-center gap-2">
          {specialRoll === 'double' && doubleTrouble ? (
            <>
              <span>Roll Again (Double)</span>
              <span className="text-xl">🎲</span>
            </>
          ) : hasRolled ? (
            <>
              <span>Next Turn</span>
              <span className="text-xl">➡️</span>
            </>
          ) : (
            <>
              <span>Roll Dice First</span>
            </>
          )}
        </div>
      </motion.button>

      {/* Special Roll or Next Turn Instruction */}
      {specialRoll === 'double' && doubleTrouble ? (
        <p className="text-sm text-center mt-2 text-yellow-600 font-medium">
          You rolled a double! Roll again.
        </p>
      ) : hasRolled ? (
        <p className="text-sm text-center mt-2 text-green-600 font-medium">
          Click "Next Turn" to continue with Player{' '}
          {getNextPlayer(currentPlayer, playerCount, null) + 1}{' '}
          {getPlayerIcon(getNextPlayer(currentPlayer, playerCount, null))}
        </p>
      ) : null}

      {/* Reset Game Button */}
      {gameStarted && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={resetGame}
            className="w-full p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset Game
          </button>
          <p className="text-xs text-gray-500 mt-1 text-center">
            This will reset all game progress and allow changing player count
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerManager;
