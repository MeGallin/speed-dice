import { useState } from 'react';
import Dice from './Dice';

export default function DiceTest() {
  const [diceValues, setDiceValues] = useState([1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [diceCount, setDiceCount] = useState(2);
  const [primaryColor, setPrimaryColor] = useState('white');
  const [dotColor, setDotColor] = useState('black');

  const handleRoll = () => {
    setIsRolling(true);

    // Reset rolling state after animation completes
    setTimeout(() => {
      setIsRolling(false);
    }, 2000);
  };

  const handleDiceRoll = (index, value) => {
    const newValues = [...diceValues];
    newValues[index] = value;
    setDiceValues(newValues);
  };

  const toggleDiceCount = () => {
    setDiceCount(diceCount === 2 ? 3 : 2);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">3D Dice Demo</h1>

      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>

        <button
          onClick={toggleDiceCount}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
        >
          {diceCount === 2 ? 'Use 3 Dice' : 'Use 2 Dice'}
        </button>
      </div>

      <div className="flex flex-wrap gap-8 justify-center mb-8">
        {Array.from({ length: diceCount }).map((_, index) => (
          <Dice
            key={index}
            value={diceValues[index]}
            rolling={isRolling}
            onRoll={(value) => handleDiceRoll(index, value)}
            size={100}
            primaryColor={primaryColor}
            dotColor={dotColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Dice Color</h2>
          <div className="flex flex-wrap gap-2">
            {['white', '#f8d7da', '#d1e7dd', '#cfe2ff', '#fff3cd'].map(
              (color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                  style={{
                    backgroundColor: color,
                    outline:
                      primaryColor === color ? '3px solid #3b82f6' : 'none',
                  }}
                />
              ),
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Dot Color</h2>
          <div className="flex flex-wrap gap-2">
            {['black', '#dc3545', '#198754', '#0d6efd', '#6f42c1'].map(
              (color) => (
                <button
                  key={color}
                  onClick={() => setDotColor(color)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                  style={{
                    backgroundColor: color,
                    outline: dotColor === color ? '3px solid #3b82f6' : 'none',
                  }}
                />
              ),
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Current Values</h2>
        <div className="flex gap-4 justify-center">
          {diceValues.slice(0, diceCount).map((value, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-gray-500">Dice {index + 1}</div>
            </div>
          ))}
          <div className="text-center">
            <div className="text-2xl font-bold">
              {diceValues
                .slice(0, diceCount)
                .reduce((sum, val) => sum + val, 0)}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
