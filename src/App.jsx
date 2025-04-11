import './App.css';
import './styles/BoardGameTheme.css';
import DiceRoller from './components/DiceRoller';
import GameSettings from './components/GameSettings';
import GameHistory from './components/GameHistory';

function App() {
  return (
    <div className="app board-game-bg">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6 text-white drop-shadow-lg">
          Speed Dice
        </h1>
        <div className="game-card">
          <GameSettings />
        </div>
        <div className="game-card">
          <DiceRoller />
        </div>
        <GameHistory />
      </div>
    </div>
  );
}

export default App;
