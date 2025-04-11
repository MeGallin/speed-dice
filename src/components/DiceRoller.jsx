import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import './Dice.css';
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

  // Function to roll the dice
  const rollDice = () => {
    // Start rolling animation
    setIsRolling(true);
    setSpecialRoll(null);

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
      <motion.button
        onClick={rollDice}
        className="mt-4 px-8 py-4 bg-red-500 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors"
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
        }}
        whileTap={{
          scale: 0.95,
          boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)',
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
        disabled={isRolling}
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </motion.button>
    </div>
  );
};

export default DiceRoller;
