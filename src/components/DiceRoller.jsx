import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import './Dice.css';
import Dice from './Dice';
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
// Create a derived atom for the total value
export const totalValueAtom = atom(
  // Read function
  (get) => {
    const values = get(diceValuesAtom);
    const count = get(diceCountAtom);

    // Make sure we're only using the active dice values
    const activeValues = values.slice(0, count);

    // Calculate the total using only the active values
    let total = 0;
    for (let i = 0; i < activeValues.length; i++) {
      total += activeValues[i];
    }

    return total;
  },
);
export const specialRollAtom = atom(null); // For storing special roll types
export const playerCountAtom = atom(2); // Default to 2 players
export const currentPlayerAtom = atom(0); // Default to first player
export const hasRolledAtom = atom(false); // Track if current player has rolled
export const gameStartedAtom = atom(false); // Track if the game has started

const DiceRoller = ({ onResetGame }) => {
  // Local state for animation and responsive sizing
  const [isRolling, setIsRolling] = useState(false);
  const [isAnimatingNextPlayer, setIsAnimatingNextPlayer] = useState(false);
  const [diceSize, setDiceSize] = useState(80); // Default size

  // Adjust dice size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setDiceSize(52); // Larger mobile size as requested
      } else if (window.innerWidth <= 768) {
        setDiceSize(50); // Tablet size
      } else {
        setDiceSize(80); // Default size
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      // Generate completely new dice values
      const newValues = Array(3)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1);

      // Update the dice values state with the new values
      setDiceValues(newValues);

      // Get the actual dice values being used (slice to the correct count)
      const activeValues = newValues.slice(0, diceCount);

      // Check for special roll patterns based on enabled rules
      const rollType = getSpecialRollType(activeValues);

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

      // Calculate total for the rolled dice directly
      const total = activeValues.reduce((sum, val) => sum + val, 0);

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
    const newCount = diceCount === 2 ? 3 : 2;

    // Update the dice count
    setDiceCount(newCount);

    // Reset special roll
    setSpecialRoll(null);

    // Generate completely new dice values when switching
    const newValues = [];
    for (let i = 0; i < newCount; i++) {
      newValues.push(Math.floor(Math.random() * 6) + 1);
    }

    // If we need 3 values but only generated 2, add a third
    if (newValues.length < 3) {
      newValues.push(Math.floor(Math.random() * 6) + 1);
    }

    // Update the dice values
    setDiceValues(newValues);

    // Force a re-render of the total by setting hasRolled to false
    setHasRolled(false);
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

  // Reset the game state - this is called from the App component
  useEffect(() => {
    if (!gameStarted) {
      // Reset local state when gameStarted becomes false
      setHasRolled(false);
      setCurrentPlayer(0);
      setSpecialRoll(null);
      setDiceValues([1, 1, 1]);
      setDiceCount(2); // Reset to default 2 dice
    }
  }, [gameStarted]);

  // No additional effects needed

  // Handle individual dice roll completion
  const handleDiceRoll = (index, value) => {
    // Update the specific die value
    const newValues = [...diceValues];
    newValues[index] = value;

    // Update the dice values state
    setDiceValues(newValues);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between items-center"
      style={{ minHeight: '60vh' }}
    >
      {/* Top Controls Row - Side by Side */}
      <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
        {/* Dice Toggle Switch */}
        <div className="flex items-center justify-center p-1 bg-red-500 border-red-600 rounded-lg shadow-md">
          <div className="flex items-center gap-2 p-1 w-full max-w-md">
            <span
              className={` ${
                diceCount === 2 ? 'rounded-lg bg-blue-500 px-4' : 'opacity-50'
              }`}
            >
              <span className="text-lg">🎲 🎲</span>
            </span>

            <motion.div
              className="relative inline-flex h-6 w-16 items-center rounded-full bg-[#fffdd0] cursor-pointer"
              onClick={toggleDiceCount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Toggle Dot */}
              <motion.span
                className="absolute top-0 left-0 h-6 w-6 rounded-full bg-red-500 z-10"
                animate={{
                  x: diceCount === 2 ? 0 : 40, // Adjust x to match new width difference
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />

              {/* Background Layer */}
              <motion.span
                className="absolute inset-0 rounded-full"
                animate={{
                  backgroundColor: '#fffdd0',
                }}
                transition={{ duration: 0.2 }}
              />

              <span className="sr-only">Toggle dice count</span>
            </motion.div>

            <span
              className={` ${
                diceCount === 3 ? 'rounded-lg bg-blue-500 px-4' : 'opacity-50'
              }`}
            >
              <span className="text-lg">🎲🎲🎲</span>
            </span>
          </div>
        </div>

        {/* Players Display */}
        <div className="flex items-center justify-center p-1 bg-red-500 border-red-600 rounded-lg shadow-md">
          <div className="flex flex-col items-center p-1 w-full max-w-md">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {playerCount} PLAYERS
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {Array.from({ length: playerCount }).map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === currentPlayer
                      ? 'bg-blue-500 text-white shadow-md transform scale-110'
                      : 'bg-gray-100 text-gray-700'
                  } transition-all duration-200`}
                  title={`Player ${index + 1}`}
                >
                  {getPlayerIcon(index)}
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-white">
              CURRENT: PLAYER {currentPlayer + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Dice Display with Total Score */}
      <div className="w-full max-w-md relative">
        {/* Total Value - Centered above dice */}
        {/* <div className="flex justify-center mb-0">
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
        </div> */}

        {/* Spacer for layout consistency */}
        <div className="h-2"></div>

        {/* Dice */}
        <div className="flex justify-evenly py-6 px-4">
          {diceValues.slice(0, diceCount).map((value, index) => (
            <Dice
              key={index}
              value={value}
              rolling={isRolling}
              onRoll={(value) => handleDiceRoll(index, value)}
              size={diceSize}
              primaryColor={specialRoll ? '#fff3cd' : 'white'}
              dotColor="black"
            />
          ))}
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
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center justify-center gap-2">
              {isRolling ? (
                <span>Rolling...</span>
              ) : hasRolled && !(specialRoll === 'double' && doubleTrouble) ? (
                <span>Waiting for Next Player</span>
              ) : (
                <>
                  <span>Roll Dice</span>
                  <span className="text-2xl">🎲</span>
                </>
              )}
            </div>
            {!isRolling && !hasRolled && (
              <span className="text-sm font-normal opacity-80">
                Player {currentPlayer + 1}'s turn{' '}
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md transform scale-110">
                  {getPlayerIcon(currentPlayer)}
                </span>
              </span>
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
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex items-center justify-center gap-2">
                <span>
                  Pass Dice to Player {((currentPlayer + 1) % playerCount) + 1}
                </span>
                <span className="text-xl">
                  {getPlayerIcon((currentPlayer + 1) % playerCount)}
                </span>
              </div>
              <span className="text-sm font-normal opacity-80">
                Click to continue
              </span>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
