import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import './Dice.css';
import { rollHistoryAtom } from './GameHistory';
import {
  generateDiceValues,
  getSpecialRollType,
  getSpecialRollMessage,
  getSpecialRollClass,
  calculateTotal,
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
  const [currentPlayer] = useAtom(currentPlayerAtom);
  const [playerCount] = useAtom(playerCountAtom);
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

  // Render a single die
  const renderDie = (value, index) => {
    // Determine if this die is part of a special roll
    const isSpecial = !isRolling && specialRoll !== null;

    // Apply different animations based on the roll type
    const getAnimationClass = () => {
      if (isRolling) return '';
      if (specialRoll === 'double' || specialRoll === 'triple')
        return 'shaking';
      if (specialRoll === 'sequence') return 'bouncing';
      return '';
    };

    return (
      <motion.div
        key={index}
        className={`die ${!isRolling ? `die-${value}` : ''} ${
          isSpecial ? 'special' : ''
        } ${getAnimationClass()}`}
        animate={{
          rotate: isRolling ? [0, 360, 720, 1080] : 0,
          scale: isRolling ? [1, 1.2, 0.8, 1] : isSpecial ? [1, 1.1, 1] : 1,
          x: isRolling ? [0, -10, 10, -10, 10, 0] : 0,
          y: isRolling ? [0, -5, 5, -5, 5, 0] : 0,
          boxShadow: isSpecial
            ? [
                '0 4px 8px rgba(0,0,0,0.2)',
                '0 0 15px rgba(255,215,0,0.7)',
                '0 4px 8px rgba(0,0,0,0.2)',
              ]
            : '0 4px 8px rgba(0,0,0,0.2)',
        }}
        transition={{
          duration: isRolling ? 0.6 : 0.3,
          ease: 'easeInOut',
          x: { duration: 0.3, ease: 'easeInOut' },
          y: { duration: 0.3, ease: 'easeInOut' },
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
        {isRolling && '?'}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Dice Count Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-lg">Dice:</span>
        <button
          onClick={toggleDiceCount}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {diceCount === 2 ? 'Switch to 3 Dice' : 'Switch to 2 Dice'}
        </button>
      </div>

      {/* Dice Display */}
      <div className="dice-container">
        <div className="flex gap-4 justify-center">
          {diceValues
            .slice(0, diceCount)
            .map((value, index) => renderDie(value, index))}
        </div>
      </div>

      {/* Total Value */}
      <div className="text-2xl font-bold">
        Total: {isRolling ? '?' : totalValue}
      </div>

      {/* Special Roll Display */}
      {specialRoll && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl font-bold p-2 rounded-lg ${getSpecialRollClass(
            specialRoll,
          )}`}
        >
          {getSpecialRollMessage(specialRoll)}
        </motion.div>
      )}

      {/* Roll Button */}
      <div className="w-full max-w-md mt-4">
        <motion.button
          onClick={rollDice}
          className={`w-full py-6 text-white text-2xl font-bold rounded-xl shadow-lg transition-colors ${
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
          {isRolling
            ? 'Rolling...'
            : hasRolled && !(specialRoll === 'double' && doubleTrouble)
            ? 'Waiting for Next Player'
            : 'Roll Dice'}
        </motion.button>

        {/* Next Player Indicator */}
        {!isRolling && !hasRolled && (
          <p className="text-center mt-2 text-gray-600">
            Player {currentPlayer + 1}'s turn
          </p>
        )}

        {hasRolled && !(specialRoll === 'double' && doubleTrouble) && (
          <p className="text-center mt-2 text-gray-600">
            Next: Player {((currentPlayer + 1) % playerCount) + 1}
          </p>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
