import './App.css';
import DiceRoller from './components/DiceRoller';
import PlayerManager from './components/PlayerManager';
import GameSettings from './components/GameSettings';
import GameHistory from './components/GameHistory';

function App() {
  return (
    <div className="app">
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
