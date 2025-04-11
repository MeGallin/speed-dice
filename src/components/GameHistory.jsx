import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  diceValuesAtom,
  diceCountAtom,
  specialRollAtom,
  currentPlayerAtom,
  playerCountAtom,
} from './DiceRoller';
import { getSpecialRollClass } from '../utils/diceLogic';

// Atom to store roll history
export const rollHistoryAtom = atom([]);

// Function to get player icon based on index (matching DiceRoller)
const getPlayerIcon = (index) => {
  const icons = ['👑', '🚀', '🏆', '🎯', '🎮', '🎲'];
  return icons[index % icons.length];
};

const GameHistory = () => {
  // Global state
  const [rollHistory, setRollHistory] = useAtom(rollHistoryAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerCount] = useAtom(playerCountAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);

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
        <h2 className="game-card-title m-0">Game History</h2>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </motion.button>
          <motion.button
            onClick={clearHistory}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-bold"
            disabled={rollHistory.length === 0}
            whileHover={{ scale: rollHistory.length === 0 ? 1 : 1.05 }}
            whileTap={{ scale: rollHistory.length === 0 ? 1 : 0.95 }}
            animate={{
              opacity: rollHistory.length === 0 ? 0.5 : 1,
            }}
          >
            Clear
          </motion.button>
        </div>
      </div>

      {/* Player Stats Summary */}
      {rollHistory.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Player Stats</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: playerCount }).map((_, index) => {
              // Calculate stats for this player
              const playerRolls = rollHistory.filter(
                (roll) => roll.player === index,
              );
              const totalRolls = playerRolls.length;
              const avgScore =
                totalRolls > 0
                  ? (
                      playerRolls.reduce((sum, roll) => sum + roll.total, 0) /
                      totalRolls
                    ).toFixed(1)
                  : '-';
              const specialRolls = playerRolls.filter(
                (roll) => roll.specialRoll,
              ).length;

              return (
                <div
                  key={index}
                  className={`flex-1 min-w-[120px] p-2 rounded-md ${
                    index === currentPlayer
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold">
                      Player {index + 1}
                    </span>
                    <span>{getPlayerIcon(index)}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Rolls: {totalRolls}</div>
                    <div>Avg: {avgScore}</div>
                    <div>Special: {specialRolls}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                  className={`p-3 mb-2 rounded-md border shadow-sm ${
                    roll.specialRoll
                      ? getSpecialRollClass(roll.specialRoll)
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-800">
                        Player {roll.player + 1}
                      </span>
                      <span className="text-sm">
                        {getPlayerIcon(roll.player)}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700 font-medium">
                      Roll #{rollHistory.length - index}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2 bg-white p-1 rounded-md shadow-inner">
                      {roll.values.map((value, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 flex items-center justify-center"
                        >
                          {renderDieFace(value)}
                        </div>
                      ))}
                    </div>
                    <span className="font-bold text-gray-600">=</span>
                    <span className="font-bold text-lg">{roll.total}</span>
                    {roll.specialRoll && (
                      <motion.span
                        className="ml-auto text-sm font-bold px-2 py-1 rounded-md"
                        animate={{
                          backgroundColor:
                            roll.specialRoll === 'double'
                              ? [
                                  'rgba(245, 158, 11, 0.1)',
                                  'rgba(245, 158, 11, 0.3)',
                                  'rgba(245, 158, 11, 0.1)',
                                ]
                              : roll.specialRoll === 'triple'
                              ? [
                                  'rgba(239, 68, 68, 0.1)',
                                  'rgba(239, 68, 68, 0.3)',
                                  'rgba(239, 68, 68, 0.1)',
                                ]
                              : [
                                  'rgba(16, 185, 129, 0.1)',
                                  'rgba(16, 185, 129, 0.3)',
                                  'rgba(16, 185, 129, 0.1)',
                                ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {roll.specialRoll === 'double' && '🎯 Double'}
                        {roll.specialRoll === 'triple' && '🔥 Triple'}
                        {roll.specialRoll === 'sequence' && '✨ Sequence'}
                      </motion.span>
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
