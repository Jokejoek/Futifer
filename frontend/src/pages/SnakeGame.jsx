import { useEffect, useRef, useState } from 'react';

export default function Snake() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // 'START', 'PLAYING', 'GAMEOVER'
  const [finalScore, setFinalScore] = useState(0);
  const scoreRef = useRef(0);
  const requestRef = useRef();
  const canChangeDirection = useRef(true);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gridSize = 20;
    const tileCount = 20;
    const canvasSize = gridSize * tileCount;

    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 1, y: 0 };
    let food = generateFood();
    let lastTime = performance.now();
    let moveTimer = 0;
    const moveInterval = 100;

    function generateFood() {
      let newFood;
      let isOnSnake;

      do {
        isOnSnake = false;
        newFood = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };

        for (let segment of snake) {
          if (segment.x === newFood.x && segment.y === newFood.y) {
            isOnSnake = true;
            break;
          }
        }
      } while (isOnSnake);

      return newFood;
    }

    const resetGame = () => {
      snake = [{ x: 10, y: 10 }];
      direction = { x: 1, y: 0 };
      food = generateFood();
      scoreRef.current = 0;
    };

    const handleInput = (e) => {
      if (!canChangeDirection.current) return;

      const key = e.code;
      const { x, y } = direction;

      switch (key) {
        case 'ArrowUp':
          if (y === 0) {
            direction = { x: 0, y: -1 };
            canChangeDirection.current = false;
          }
          break;
        case 'ArrowDown':
          if (y === 0) {
            direction = { x: 0, y: 1 };
            canChangeDirection.current = false;
          }
          break;
        case 'ArrowLeft':
          if (x === 0) {
            direction = { x: -1, y: 0 };
            canChangeDirection.current = false;
          }
          break;
        case 'ArrowRight':
          if (x === 0) {
            direction = { x: 1, y: 0 };
            canChangeDirection.current = false;
          }
          break;
        default:
          break;
      }
    };

    const loop = (time) => {
      const delta = time - lastTime;
      moveTimer += delta;
      lastTime = time;

      if (moveTimer > moveInterval) {
        moveTimer = 0;

        const head = { ...snake[0] };
        head.x += direction.x;
        head.y += direction.y;
        snake.unshift(head);

        // Wall collision
        if (
          head.x < 0 || head.x >= tileCount ||
          head.y < 0 || head.y >= tileCount
        ) {
          setFinalScore(scoreRef.current);
          setGameState('GAMEOVER');
          return;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) {
            setFinalScore(scoreRef.current);
            setGameState('GAMEOVER');
            return;
          }
        }

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          scoreRef.current += 1;
          food = generateFood();
        } else {
          snake.pop();
        }

        canChangeDirection.current = true;
      }

      // Draw
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = '#f44336';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

      ctx.fillStyle = '#4CAF50';
      snake.forEach((s) => {
        ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize, gridSize);
      });

      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 20);

      requestRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', handleInput);
    resetGame();
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('keydown', handleInput);
    };
  }, [gameState]);

  const startGame = () => {
    scoreRef.current = 0;
    setGameState('PLAYING');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold text-gray-800">🐍 Simple Snake Game</h2>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-gray-400 rounded-lg bg-white shadow-md"
        />

        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg">
            {gameState === 'GAMEOVER' && (
              <div className="text-center mb-4">
                <h3 className="text-3xl font-bold text-red-500">GAME OVER</h3>
                <p className="text-white text-xl">Score: {finalScore}</p>
              </div>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full text-lg transition shadow-lg"
            >
              {gameState === 'START' ? 'Start Game' : 'Try Again'}
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-sm">
        Use <span className="font-bold border px-1 rounded">Arrow Keys</span> to move
      </p>
    </div>
  );
}
