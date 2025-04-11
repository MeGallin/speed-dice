import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { diceCountAtom } from './DiceRoller';
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
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
        Game Settings
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

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
          <h3 className="text-lg font-bold mb-4">House Rules</h3>

          {/* Speed Mode Toggle */}
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold">Speed Mode</h4>
                <p className="text-sm text-gray-600">
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
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <h4 className="font-bold mb-3">Feedback Settings</h4>

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
          <div className="space-y-4">
            {/* Double Trouble */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Double Trouble</h4>
                <p className="text-sm text-gray-600">Roll again on doubles</p>
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
                <h4 className="font-medium">Triple Threat</h4>
                <p className="text-sm text-gray-600">Get paid on triples</p>
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
                <h4 className="font-medium">Sequence Bonus</h4>
                <p className="text-sm text-gray-600">
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
