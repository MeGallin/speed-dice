import './App.css';
import DiceRoller from './components/DiceRoller';
import PlayerManager from './components/PlayerManager';
import GameSettings from './components/GameSettings';
import GameHistory from './components/GameHistory';

function App() {
  return (
    <div className="app">
      <h1 className="text-3xl font-bold text-center my-6">Speed Dice</h1>
      <div className="max-w-4xl mx-auto">
        <GameSettings />
        <DiceRoller />
        <PlayerManager />
        <GameHistory />
      </div>
    </div>
  );
}

export default App;
