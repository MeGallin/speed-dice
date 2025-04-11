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
} from './GameSettings';

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

  // Function to roll the dice
  const rollDice = () => {
    // Start rolling animation
    setIsRolling(true);
    setSpecialRoll(null);

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
      if (
        (rollType === 'double' && doubleTrouble) ||
        (rollType === 'triple' && tripleThreat) ||
        (rollType === 'sequence' && sequenceBonus)
      ) {
        setSpecialRoll(rollType);
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
    return (
      <motion.div
        key={index}
        className={`die ${!isRolling ? `die-${value}` : ''}`}
        animate={{
          rotate: isRolling ? [0, 360, 720, 1080] : 0,
          scale: isRolling ? [1, 1.2, 0.8, 1] : 1,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
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
      <div className="flex gap-4 justify-center">
        {diceValues
          .slice(0, diceCount)
          .map((value, index) => renderDie(value, index))}
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
        whileTap={{ scale: 0.95 }}
        disabled={isRolling}
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </motion.button>
    </div>
  );
};

export default DiceRoller;
