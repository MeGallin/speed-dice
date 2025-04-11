import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  diceValuesAtom,
  diceCountAtom,
  specialRollAtom,
  currentPlayerAtom,
} from './DiceRoller';
import { getSpecialRollClass } from '../utils/diceLogic';

// Atom to store roll history
export const rollHistoryAtom = atom([]);

const GameHistory = () => {
  // Global state
  const [rollHistory, setRollHistory] = useAtom(rollHistoryAtom);
  const [isExpanded, setIsExpanded] = useState(false);

  // Clear history function
  const clearHistory = () => {
    setRollHistory([]);
  };

  // Render a single die face
  const renderDieFace = (value) => {
    return (
      <div className={`history-die die-${value}`}>
        {/* Die face is styled with CSS */}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Game History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={clearHistory}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
            disabled={rollHistory.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      {rollHistory.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No rolls yet. Start rolling!
        </p>
      ) : (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96' : 'max-h-40'
          }`}
        >
          <div
            className="overflow-y-auto pr-2"
            style={{ maxHeight: isExpanded ? '24rem' : '10rem' }}
          >
            <AnimatePresence>
              {rollHistory.map((roll, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 mb-2 rounded-md border ${
                    roll.specialRoll
                      ? getSpecialRollClass(roll.specialRoll)
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      Player {roll.player + 1}
                    </span>
                    <span className="text-sm text-gray-500">
                      Roll #{rollHistory.length - index}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {roll.values.map((value, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 flex items-center justify-center"
                        >
                          {renderDieFace(value)}
                        </div>
                      ))}
                    </div>
                    <span className="font-bold">=</span>
                    <span className="font-bold">{roll.total}</span>
                    {roll.specialRoll && (
                      <span className="ml-auto text-sm font-medium">
                        {roll.specialRoll === 'double' && '🎯 Double'}
                        {roll.specialRoll === 'triple' && '🔥 Triple'}
                        {roll.specialRoll === 'sequence' && '✨ Sequence'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistory;
