import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Lobby from './Lobby';
import XO from './games/XO';
import FruitCut from './games/FruitCut';
import Dino from './games/Dino';
import SnakeGame from './games/SnakeGame';

export default function App() {
  return (
    <BrowserRouter>
      <header className="p-4 border-b flex justify-between">
        <Link to="/" className="font-bold">MiniGame</Link>
        <nav className="space-x-4">
          <Link to="/xo">XO</Link>
          <Link to="/fruitcut">Fruit Cut</Link>
          <Link to="/dino">Dino</Link>
          <Link to="/snakegame">Snake Game</Link>
        </nav>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/xo" element={<XO />} />
          <Route path="/fruitcut" element={<FruitCut />} />
          <Route path="/dino" element={<Dino />} />
          <Route path="/snakegame" element={<SnakeGame />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
