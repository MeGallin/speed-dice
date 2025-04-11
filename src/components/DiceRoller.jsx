import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import './Dice.css';
import { rollHistoryAtom } from './GameHistory';

// Function to get player icon based on index
const getPlayerIcon = (index) => {
  const icons = ['👑', '🚀', '🏆', '🎯', '🎮', '🎲'];
  return icons[index % icons.length];
};
import {
  generateDiceValues,
  getSpecialRollType,
  getSpecialRollMessage,
  getSpecialRollClass,
  calculateTotal,
  getNextPlayer,
} from '../utils/diceLogic';
import {
  doubleTroubleAtom,
  tripleThreatAtom,
  sequenceBonusAtom,
  enableVibrationAtom,
  enableSoundAtom,
} from './GameSettings';
import { provideFeedback } from '../utils/feedbackEffects';

// Atoms for global state
export const diceCountAtom = atom(2); // Default to 2 dice
export const diceValuesAtom = atom([1, 1, 1]); // Default values for 3 dice
export const totalValueAtom = atom((get) => {
  const values = get(diceValuesAtom);
  const count = get(diceCountAtom);
  return calculateTotal(values.slice(0, count));
});
export const specialRollAtom = atom(null); // For storing special roll types
export const playerCountAtom = atom(2); // Default to 2 players
export const currentPlayerAtom = atom(0); // Default to first player
export const hasRolledAtom = atom(false); // Track if current player has rolled
export const gameStartedAtom = atom(false); // Track if the game has started

const DiceRoller = () => {
  // Local state for animation
  const [isRolling, setIsRolling] = useState(false);
  const [isAnimatingNextPlayer, setIsAnimatingNextPlayer] = useState(false);

  // Global state
  const [diceCount, setDiceCount] = useAtom(diceCountAtom);
  const [diceValues, setDiceValues] = useAtom(diceValuesAtom);
  const [totalValue] = useAtom(totalValueAtom);
  const [specialRoll, setSpecialRoll] = useAtom(specialRollAtom);

  // Get game settings
  const [doubleTrouble] = useAtom(doubleTroubleAtom);
  const [tripleThreat] = useAtom(tripleThreatAtom);
  const [sequenceBonus] = useAtom(sequenceBonusAtom);
  const [enableVibration] = useAtom(enableVibrationAtom);
  const [enableSound] = useAtom(enableSoundAtom);

  // Global state for roll history and player tracking
  const [rollHistory, setRollHistory] = useAtom(rollHistoryAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [playerCount, setPlayerCount] = useAtom(playerCountAtom);
  const [hasRolled, setHasRolled] = useAtom(hasRolledAtom);

  // Global state for game tracking
  const [gameStarted, setGameStarted] = useAtom(gameStartedAtom);

  // Player colors for visual distinction (matching PlayerManager)
  const playerColors = [
    'bg-blue-500 hover:bg-blue-600',
    'bg-red-500 hover:bg-red-600',
    'bg-green-500 hover:bg-green-600',
    'bg-yellow-500 hover:bg-yellow-600',
    'bg-purple-500 hover:bg-purple-600',
    'bg-pink-500 hover:bg-pink-600',
  ];

  // Function to roll the dice
  const rollDice = () => {
    // Start rolling animation
    setIsRolling(true);
    setSpecialRoll(null);

    // Mark that the current player has rolled
    setHasRolled(true);

    // Mark that the game has started (after first roll)
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Provide initial feedback
    provideFeedback(null, enableVibration, enableSound);

    // Generate random dice values after a short delay
    setTimeout(() => {
      const newValues = generateDiceValues(diceCount);

      // If we're only using 2 dice, keep the third dice value but don't show it
      if (diceCount === 2) {
        newValues.push(diceValues[2] || 1);
      }

      setDiceValues(newValues);

      // Check for special roll patterns based on enabled rules
      const rollType = getSpecialRollType(newValues.slice(0, diceCount));

      // Only set special roll if the corresponding rule is enabled
      let effectiveRollType = null;
      if (
        (rollType === 'double' && doubleTrouble) ||
        (rollType === 'triple' && tripleThreat) ||
        (rollType === 'sequence' && sequenceBonus)
      ) {
        setSpecialRoll(rollType);
        effectiveRollType = rollType;

        // Provide special roll feedback
        provideFeedback(effectiveRollType, enableVibration, enableSound);
      }

      // Calculate total for the rolled dice
      const total = calculateTotal(newValues.slice(0, diceCount));

      // Add roll to history
      setRollHistory((prev) => [
        {
          values: newValues.slice(0, diceCount),
          total,
          specialRoll: effectiveRollType,
          player: currentPlayer,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);

      setIsRolling(false);
    }, 600);
  };

  // Toggle between 2 and 3 dice
  const toggleDiceCount = () => {
    setDiceCount(diceCount === 2 ? 3 : 2);
    setSpecialRoll(null);
  };

  // Handle next player button click
  const handleNextPlayer = () => {
    setIsAnimatingNextPlayer(true);

    // Short delay for animation
    setTimeout(() => {
      // Only consider doubles for next player logic if doubleTrouble is enabled
      const effectiveSpecialRoll = doubleTrouble ? specialRoll : null;
      const nextPlayer = getNextPlayer(
        currentPlayer,
        playerCount,
        effectiveSpecialRoll,
      );

      // Update the current player atom
      setCurrentPlayer(nextPlayer);

      // Reset the hasRolled state for the new player
      setHasRolled(false);

      setIsAnimatingNextPlayer(false);
    }, 300);
  };

  // Reset the game state
  const resetGame = () => {
    setGameStarted(false);
    setHasRolled(false);
    setCurrentPlayer(0);
    setSpecialRoll(null);
    setDiceValues([1, 1, 1]);
    setRollHistory([]);
  };

  // Render a single die
  const renderDie = (value, index) => {
    // Determine if this die is part of a special roll
    const isSpecial = !isRolling && specialRoll !== null;

    // Apply different animations based on the roll type
    const getAnimationClass = () => {
      if (isRolling) return 'enhanced-rolling';
      if (specialRoll === 'double' || specialRoll === 'triple')
        return 'shaking';
      if (specialRoll === 'sequence') return 'bouncing';
      return '';
    };

    return (
      <motion.div
        key={index}
        className={`die enhanced-die ${!isRolling ? `die-${value}` : ''} ${
          isSpecial ? 'special' : ''
        } ${getAnimationClass()}`}
        animate={{
          rotate: isRolling ? [0, 360, 720, 1080] : 0,
          scale: isRolling ? [1, 1.2, 0.8, 1] : isSpecial ? [1, 1.1, 1] : 1,
          x: isRolling ? [0, -15, 15, -15, 15, 0] : 0,
          y: isRolling ? [0, -20, 10, -15, 5, 0] : 0,
          boxShadow: isSpecial
            ? [
                '0 4px 8px rgba(0,0,0,0.2)',
                '0 0 20px rgba(255, 215, 0, 0.8)',
                '0 4px 8px rgba(0,0,0,0.2)',
              ]
            : '0 4px 8px rgba(0,0,0,0.2)',
        }}
        transition={{
          duration: isRolling ? 0.8 : 0.3,
          ease: 'easeInOut',
          x: { duration: 0.4, ease: 'easeInOut' },
          y: { duration: 0.4, ease: 'easeInOut' },
          scale: {
            duration: isSpecial ? 1.5 : 0.6,
            repeat: isSpecial ? Infinity : 0,
            repeatType: 'reverse',
          },
          boxShadow: {
            duration: isSpecial ? 1.5 : 0.6,
            repeat: isSpecial ? Infinity : 0,
            repeatType: 'reverse',
          },
        }}
      >
        {isRolling ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-2xl"
          >
            ?
          </motion.span>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Top Controls Row - Side by Side */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-2">
        {/* Dice Switch */}

        <div className="flex items-center justify-center bg-gray-100 text-white p-3 rounded-lg shadow-md">
          <motion.button
            onClick={toggleDiceCount}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {diceCount === 2 ? '3 Dice' : '2 Dice'}
          </motion.button>
        </div>

        {/* Current Player Display */}
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
          <div className="flex-shrink-0">
            <motion.div
              className={`player-token w-10 h-10 text-lg ${
                playerColors[currentPlayer].split(' ')[0]
              }`}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 4px 8px rgba(0,0,0,0.2)',
                  '0 8px 16px rgba(0,0,0,0.3)',
                  '0 4px 8px rgba(0,0,0,0.2)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {getPlayerIcon(currentPlayer)}
            </motion.div>
          </div>
          <div className="flex-grow">
            <div className="text-xs font-medium text-gray-500">
              Current Player:
            </div>
            <div
              className={`font-bold ${
                currentPlayer === 0
                  ? 'text-blue-600'
                  : currentPlayer === 1
                  ? 'text-red-600'
                  : currentPlayer === 2
                  ? 'text-green-600'
                  : currentPlayer === 3
                  ? 'text-yellow-600'
                  : currentPlayer === 4
                  ? 'text-purple-600'
                  : 'text-pink-600'
              }`}
            >
              Player {currentPlayer + 1}
            </div>
          </div>
          <div className="flex-shrink-0">
            {/* Player Tokens - Smaller to fit 6 players */}
            <div className="flex flex-wrap gap-1 max-w-[90px] justify-end">
              {Array.from({ length: playerCount }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    index === currentPlayer
                      ? playerColors[index].split(' ')[0]
                      : 'bg-gray-300'
                  } ${
                    index === currentPlayer ? 'text-white' : 'text-gray-700'
                  }`}
                  animate={{
                    scale: index === currentPlayer ? 1.2 : 1,
                    y: index === currentPlayer ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {index + 1}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dice Display with Total Score */}
      <div className="w-full max-w-md relative">
        {/* Total Value - Centered above dice */}
        <div className="flex justify-center mb-0">
          <motion.div
            key={totalValue} // Force re-render on value change
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="text-red-600 font-bold text-2xl">
              <span className="text-3xl font-bold">
                {isRolling ? '?' : totalValue}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Dice */}
        <div className="flex justify-around py-6 px-4">
          {diceValues
            .slice(0, diceCount)
            .map((value, index) => renderDie(value, index))}
        </div>

        {/* Special Roll Display */}
        <AnimatePresence>
          {specialRoll && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`special-roll-banner ${getSpecialRollClass(
                specialRoll,
              )}`}
            >
              {getSpecialRollMessage(specialRoll)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Controls */}
      <div className="w-full max-w-md mt-4 flex flex-col gap-3">
        {/* Roll Button */}
        <motion.button
          onClick={rollDice}
          className={`roll-button w-full py-6 text-white text-2xl font-bold rounded-xl shadow-lg transition-colors ${
            hasRolled && !(specialRoll === 'double' && doubleTrouble)
              ? 'bg-gray-500 cursor-not-allowed'
              : playerColors[currentPlayer]
          }`}
          whileHover={{
            scale:
              hasRolled && !(specialRoll === 'double' && doubleTrouble)
                ? 1
                : 1.02,
            boxShadow:
              hasRolled && !(specialRoll === 'double' && doubleTrouble)
                ? '0 4px 8px rgba(0,0,0,0.2)'
                : '0 0 20px rgba(0, 0, 0, 0.3)',
          }}
          whileTap={{
            scale:
              hasRolled && !(specialRoll === 'double' && doubleTrouble)
                ? 1
                : 0.98,
            boxShadow:
              hasRolled && !(specialRoll === 'double' && doubleTrouble)
                ? '0 4px 8px rgba(0,0,0,0.2)'
                : '0 0 10px rgba(0, 0, 0, 0.2)',
          }}
          animate={{
            scale: isRolling ? [1, 1.05, 0.95, 1.05, 0.95, 1] : 1,
            rotate: isRolling ? [0, -1, 1, -1, 1, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            scale: { repeat: isRolling ? Infinity : 0 },
            rotate: { repeat: isRolling ? Infinity : 0 },
          }}
          disabled={
            isRolling ||
            (hasRolled && !(specialRoll === 'double' && doubleTrouble))
          }
        >
          <div className="flex items-center justify-center gap-2">
            {isRolling ? (
              <span>Rolling...</span>
            ) : hasRolled && !(specialRoll === 'double' && doubleTrouble) ? (
              <span>Waiting for Next Player</span>
            ) : (
              <>
                <span>Roll Dice</span>
                <span className="text-xl">🎲</span>
              </>
            )}
          </div>
        </motion.button>

        {/* Next Turn Button */}
        {hasRolled && !(specialRoll === 'double' && doubleTrouble) && (
          <motion.button
            onClick={handleNextPlayer}
            className="w-full p-4 text-white rounded-lg font-bold text-lg bg-green-600 hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            animate={{
              boxShadow: [
                '0 0 5px rgba(22, 163, 74, 0.3)',
                '0 0 20px rgba(22, 163, 74, 0.6)',
                '0 0 5px rgba(22, 163, 74, 0.3)',
              ],
              y: [0, -3, 0],
            }}
            transition={{
              y: { repeat: Infinity, duration: 1.5, repeatType: 'reverse' },
              boxShadow: {
                repeat: Infinity,
                duration: 1.5,
                repeatType: 'reverse',
              },
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Next Turn</span>
              <span className="text-xl">➡️</span>
            </div>
          </motion.button>
        )}

        {/* Turn Indicators */}
        {!isRolling && !hasRolled && (
          <p className="text-center text-gray-600 font-medium">
            Player {currentPlayer + 1}'s turn {getPlayerIcon(currentPlayer)}
          </p>
        )}

        {hasRolled && !(specialRoll === 'double' && doubleTrouble) && (
          <p className="text-center text-green-600 font-medium">
            Click "Next Turn" to continue with Player{' '}
            {((currentPlayer + 1) % playerCount) + 1}{' '}
            {getPlayerIcon((currentPlayer + 1) % playerCount)}
          </p>
        )}

        {/* Reset Game Button */}
        {gameStarted && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <motion.button
              onClick={resetGame}
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset Game
            </motion.button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              This will reset all game progress and allow changing player count
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
