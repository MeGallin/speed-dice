import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  diceCountAtom,
  playerCountAtom,
  gameStartedAtom,
  currentPlayerAtom,
} from './DiceRoller';
import { isVibrationSupported } from '../utils/feedbackEffects';
import { rollHistoryAtom } from './GameHistory';
import { getSpecialRollClass } from '../utils/diceLogic';

// Atoms for game settings
export const doubleTroubleAtom = atom(true); // Roll again on doubles
export const tripleThreatAtom = atom(true); // Get paid on triples
export const sequenceBonusAtom = atom(true); // Trigger mystery event on sequence
export const speedModeAtom = atom(false); // Auto-selects 3 dice and bonus rules

// Atoms for feedback settings
export const enableVibrationAtom = atom(isVibrationSupported()); // Enable vibration feedback
export const enableSoundAtom = atom(true); // Enable sound feedback

// Atom for 3D dice toggle
export const show3DDiceAtom = atom(false); // Toggle between classic and 3D dice

const GameSettings = () => {
  // Global state
  const [doubleTrouble, setDoubleTrouble] = useAtom(doubleTroubleAtom);
  const [tripleThreat, setTripleThreat] = useAtom(tripleThreatAtom);
  const [sequenceBonus, setSequenceBonus] = useAtom(sequenceBonusAtom);
  const [speedMode, setSpeedMode] = useAtom(speedModeAtom);
  const [diceCount, setDiceCount] = useAtom(diceCountAtom);
  const [playerCount, setPlayerCount] = useAtom(playerCountAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [gameStarted] = useAtom(gameStartedAtom);
  const [enableVibration, setEnableVibration] = useAtom(enableVibrationAtom);
  const [enableSound, setEnableSound] = useAtom(enableSoundAtom);
  const [show3DDice, setShow3DDice] = useAtom(show3DDiceAtom);

  // Check if vibration is supported
  const vibrationSupported = isVibrationSupported();

  // Local state
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'history'
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [rollHistory, setRollHistory] = useAtom(rollHistoryAtom);

  // Toggle speed mode
  const handleSpeedModeToggle = () => {
    const newSpeedMode = !speedMode;
    setSpeedMode(newSpeedMode);

    // If speed mode is enabled, auto-select 3 dice and enable all bonus rules
    if (newSpeedMode) {
      setDiceCount(3);
      setDoubleTrouble(true);
      setTripleThreat(true);
      setSequenceBonus(true);
    }
  };

  // Function to get player icon based on index (matching DiceRoller)
  const getPlayerIcon = (index) => {
    const icons = ['👑', '🚀', '🏆', '🎯', '🎮', '🎲'];
    return icons[index % icons.length];
  };

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
    <div className="w-full max-w-md mx-auto mt-6 mb-8">
      {/* Tab Buttons */}
      <div className="flex mb-2">
        <motion.button
          onClick={() => {
            setActiveTab('settings');
          }}
          className={`flex-1 p-3 rounded-t-lg flex items-center justify-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold">Settings</span>
        </motion.button>

        <motion.button
          onClick={() => {
            setActiveTab('history');
          }}
          className={`flex-1 p-3 rounded-t-lg flex items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-blue-700 to-cyan-800 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold">History</span>
        </motion.button>
      </div>

      {/* Content Panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: 'auto',
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md mt-2 overflow-hidden"
      >
        {activeTab === 'settings' ? (
          <div className="p-2">
            <h3 className="game-card-title mb-4">Game Setup</h3>

            {/* Player Count Selector */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-purple-800">
                    Number of Players
                  </h4>
                  <p className="text-sm text-purple-700">
                    Select how many players will participate
                  </p>
                </div>
                <div className="relative">
                  <select
                    value={playerCount}
                    onChange={(e) => {
                      const count = parseInt(e.target.value, 10);
                      setPlayerCount(count);
                      // Reset current player if needed
                      if (currentPlayer >= count) {
                        setCurrentPlayer(0);
                      }
                    }}
                    disabled={gameStarted}
                    className={`px-4 py-2 rounded-lg appearance-none ${
                      gameStarted
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                    } font-bold`}
                  >
                    {[2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Players
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg
                      className="fill-current h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                  {gameStarted && (
                    <p className="text-xs text-red-500 mt-1">
                      Cannot change during game
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h3 className="game-card-title mb-4">House Rules</h3>

            {/* Speed Mode Toggle */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-orange-800">Speed Mode</h4>
                  <p className="text-sm text-orange-700">
                    Auto-selects 3 dice and enables all bonus rules
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={speedMode}
                    onChange={handleSpeedModeToggle}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* 3D Dice Toggle (Disabled - Upgrade Feature) */}
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100 shadow-sm opacity-75">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-cyan-800">3D Dice</h4>
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      PREMIUM
                    </span>
                  </div>
                  <p className="text-sm text-cyan-700">
                    Switch between classic and 3D dice
                  </p>
                  <p className="text-xs text-yellow-600 mt-1 font-medium">
                    Available in the premium upgrade
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={false}
                    disabled={true}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 opacity-50"></div>
                </label>
              </div>
            </div>

            {/* Feedback Settings */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm">
              <h4 className="font-bold mb-3 text-blue-800">
                Feedback Settings
              </h4>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">Sound Effects</h4>
                  <p className="text-sm text-gray-600">
                    Play sounds during dice rolls
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enableSound}
                    onChange={() => setEnableSound(!enableSound)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Vibration Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Vibration</h4>
                  <p className="text-sm text-gray-600">
                    {vibrationSupported
                      ? 'Vibrate device during dice rolls'
                      : 'Not supported on this device'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enableVibration}
                    onChange={() => setEnableVibration(!enableVibration)}
                    disabled={!vibrationSupported}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                      !vibrationSupported ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  ></div>
                </label>
              </div>
            </div>

            {/* Individual Rule Toggles */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100 shadow-sm">
              <h4 className="font-bold mb-3 text-green-800">
                Special Roll Rules
              </h4>

              {/* Double Trouble */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Double Trouble</h4>
                  <p className="text-sm text-green-700">
                    Roll again on doubles
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={doubleTrouble}
                    onChange={() => setDoubleTrouble(!doubleTrouble)}
                    disabled={speedMode}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                      speedMode ? 'opacity-50' : ''
                    }`}
                  ></div>
                </label>
              </div>

              {/* Triple Threat */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Triple Threat</h4>
                  <p className="text-sm text-green-700">Get paid on triples</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tripleThreat}
                    onChange={() => setTripleThreat(!tripleThreat)}
                    disabled={speedMode}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                      speedMode ? 'opacity-50' : ''
                    }`}
                  ></div>
                </label>
              </div>

              {/* Sequence Bonus */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Sequence Bonus</h4>
                  <p className="text-sm text-green-700">
                    Trigger mystery event on sequence
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sequenceBonus}
                    onChange={() => setSequenceBonus(!sequenceBonus)}
                    disabled={speedMode}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                      speedMode ? 'opacity-50' : ''
                    }`}
                  ></div>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="game-card-title m-0">Game History</h3>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isHistoryExpanded ? 'Collapse' : 'Expand'}
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
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  Player Stats
                </h3>
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
                            playerRolls.reduce(
                              (sum, roll) => sum + roll.total,
                              0,
                            ) / totalRolls
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
                  isHistoryExpanded ? 'max-h-96' : 'max-h-40'
                }`}
              >
                <div
                  className="overflow-y-auto pr-2"
                  style={{ maxHeight: isHistoryExpanded ? '24rem' : '10rem' }}
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
                          <span className="font-bold text-lg">
                            {roll.total}
                          </span>
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
        )}
      </motion.div>
    </div>
  );
};

export default GameSettings;
