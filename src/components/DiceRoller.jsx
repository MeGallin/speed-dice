import { useState } from 'react';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import './Dice.css';

// Atoms for global state
export const diceCountAtom = atom(2); // Default to 2 dice
export const diceValuesAtom = atom([1, 1, 1]); // Default values for 3 dice
export const totalValueAtom = atom((get) => {
  const values = get(diceValuesAtom);
  const count = get(diceCountAtom);
  return values.slice(0, count).reduce((sum, value) => sum + value, 0);
});
export const specialRollAtom = atom(null); // For storing special roll types

const DiceRoller = () => {
  // Local state for animation
  const [isRolling, setIsRolling] = useState(false);

  // Global state
  const [diceCount, setDiceCount] = useAtom(diceCountAtom);
  const [diceValues, setDiceValues] = useAtom(diceValuesAtom);
  const [totalValue] = useAtom(totalValueAtom);
  const [specialRoll, setSpecialRoll] = useAtom(specialRollAtom);

  // Function to roll the dice
  const rollDice = () => {
    // Start rolling animation
    setIsRolling(true);
    setSpecialRoll(null);

    // Generate random dice values after a short delay
    setTimeout(() => {
      const newValues = Array(diceCount)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1);

      // If we're only using 2 dice, keep the third dice value but don't show it
      if (diceCount === 2) {
        newValues.push(diceValues[2]);
      }

      setDiceValues(newValues);
      checkSpecialRolls(newValues.slice(0, diceCount));
      setIsRolling(false);
    }, 600);
  };

  // Check for special roll patterns
  const checkSpecialRolls = (values) => {
    // Check for doubles (only in 2-dice mode)
    if (diceCount === 2 && values[0] === values[1]) {
      setSpecialRoll('double');
      return;
    }

    // Check for triples (only in 3-dice mode)
    if (diceCount === 3 && values[0] === values[1] && values[1] === values[2]) {
      setSpecialRoll('triple');
      return;
    }

    // Check for sequence (only in 3-dice mode)
    if (diceCount === 3) {
      const sorted = [...values].sort((a, b) => a - b);
      if (
        (sorted[0] + 1 === sorted[1] && sorted[1] + 1 === sorted[2]) || // e.g., 1-2-3
        (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 4) || // Special case 1-2-4
        (sorted[0] === 1 && sorted[1] === 3 && sorted[2] === 5) || // Special case 1-3-5
        (sorted[0] === 2 && sorted[1] === 4 && sorted[2] === 6) // Special case 2-4-6
      ) {
        setSpecialRoll('sequence');
        return;
      }
    }
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
          className={`text-xl font-bold p-2 rounded-lg ${
            specialRoll === 'double'
              ? 'bg-yellow-200 text-yellow-800'
              : specialRoll === 'triple'
              ? 'bg-red-200 text-red-800'
              : 'bg-green-200 text-green-800'
          }`}
        >
          {specialRoll === 'double' && '🎯 Double! Roll Again!'}
          {specialRoll === 'triple' &&
            '🔥 Triple Threat! Collect from each player!'}
          {specialRoll === 'sequence' && '✨ Sequence! Bonus Activated!'}
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
