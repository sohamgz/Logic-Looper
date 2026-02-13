import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  grid: number[][];
  solution: number[][];
  onSubmit: (grid: number[][]) => void;
}

export const MatrixPuzzle = ({ grid, solution, onSubmit }: Props) => {
  const [userGrid, setUserGrid] = useState<number[][]>(grid.map(row => [...row]));

  const handleCellChange = (row: number, col: number, value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 4) {
      const newGrid = userGrid.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? num : c)) : r
      );
      setUserGrid(newGrid);
    }
  };

  const isOriginal = (row: number, col: number) => grid[row][col] !== 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {userGrid.map((row, i) =>
          row.map((cell, j) => (
            <motion.input
              key={`${i}-${j}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="number"
              min="1"
              max="4"
              value={cell || ''}
              onChange={(e) => handleCellChange(i, j, e.target.value)}
              disabled={isOriginal(i, j)}
              className={`
                w-16 h-16 text-center text-2xl font-bold rounded-lg border-2
                ${isOriginal(i, j)
                  ? 'bg-gray-200 border-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-white border-primary-500 text-primary-700 focus:ring-2 focus:ring-primary-500'
                }
              `}
            />
          ))
        )}
      </div>

      <button
        onClick={() => onSubmit(userGrid)}
        className="btn-primary w-full max-w-xs mx-auto block"
      >
        Submit Answer
      </button>
    </div>
  );
};