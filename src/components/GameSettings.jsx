import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion } from 'framer-motion';
import {
  diceCountAtom,
  playerCountAtom,
  gameStartedAtom,
  currentPlayerAtom,
} from './DiceRoller';
import { isVibrationSupported } from '../utils/feedbackEffects';

// Atoms for game settings
export const doubleTroubleAtom = atom(true); // Roll again on doubles
export const tripleThreatAtom = atom(true); // Get paid on triples
export const sequenceBonusAtom = atom(true); // Trigger mystery event on sequence
export const speedModeAtom = atom(false); // Auto-selects 3 dice and bonus rules

// Atoms for feedback settings
export const enableVibrationAtom = atom(isVibrationSupported()); // Enable vibration feedback
export const enableSoundAtom = atom(true); // Enable sound feedback

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

  // Check if vibration is supported
  const vibrationSupported = isVibrationSupported();

  // Local state
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-8">
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-lg flex items-center justify-center gap-2 hover:from-purple-800 hover:to-indigo-900 transition-colors shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-lg font-bold">Game Settings</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.button>

      {/* Settings Panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md mt-2 overflow-hidden"
      >
        <div className="p-4">
          <h3 className="game-card-title mb-4">Game Setup</h3>

          {/* Player Count Selector */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-purple-800">Number of Players</h4>
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

          {/* Feedback Settings */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="font-bold mb-3 text-blue-800">Feedback Settings</h4>

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
                <p className="text-sm text-green-700">Roll again on doubles</p>
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
      </motion.div>
    </div>
  );
};

export default GameSettings;
