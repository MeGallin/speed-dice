import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion } from 'framer-motion';
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
        disabled={
          isAnimating ||
          (!hasRolled && !(specialRoll === 'double' && doubleTrouble))
        }
        className={`w-full p-2 text-white rounded-md transition-colors ${
          !hasRolled && !(specialRoll === 'double' && doubleTrouble)
            ? 'bg-gray-400 cursor-not-allowed'
            : specialRoll === 'double' && doubleTrouble
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-blue-500 hover:bg-blue-600 animate-pulse'
        }`}
      >
        {specialRoll === 'double' && doubleTrouble
          ? 'Roll Again (Double)'
          : hasRolled
          ? 'Next Player'
          : 'Roll Dice First'}
      </button>

      {/* Special Roll or Next Player Instruction */}
      {specialRoll === 'double' && doubleTrouble ? (
        <p className="text-sm text-center mt-2 text-yellow-600">
          You rolled a double! Roll again.
        </p>
      ) : hasRolled ? (
        <p className="text-sm text-center mt-2 text-blue-600">
          Click "Next Player" to continue with Player{' '}
          {getNextPlayer(currentPlayer, playerCount, null) + 1}
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
