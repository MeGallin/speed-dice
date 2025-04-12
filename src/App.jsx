import { useState } from 'react';
import './App.css';
import './styles/BoardGameTheme.css';
import DiceRoller from './components/DiceRoller';
import DiceTest from './components/DiceTest';
import GameSettings from './components/GameSettings';
import GameHistory from './components/GameHistory';

function App() {
  const [showNewDice, setShowNewDice] = useState(false);

  return (
    <div className="app board-game-bg">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6 text-white drop-shadow-lg">
          Speed Dice
        </h1>

        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowNewDice(!showNewDice)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            {showNewDice ? 'Switch to Classic Dice' : 'Switch to 3D Dice'}
          </button>
        </div>

        {!showNewDice ? (
          <>
            <div className="game-card">
              <GameSettings />
            </div>
            <div className="game-card">
              <DiceRoller />
            </div>
            <GameHistory />
          </>
        ) : (
          <div className="game-card">
            <DiceTest />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
