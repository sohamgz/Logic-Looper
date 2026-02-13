import { useState } from 'react';
import { motion } from 'framer-motion';
export const DeductionPuzzle = ({ clues, grid, solution, onSubmit }) => {
    const [userSolution, setUserSolution] = useState(grid.rows.reduce((acc, person) => ({ ...acc, [person]: '' }), {}));
    const handleSelect = (person, color) => {
        setUserSolution({ ...userSolution, [person]: color });
    };
    const isComplete = grid.rows.every(person => userSolution[person] !== '');
    return (<div className="space-y-6">
      {/* Clues */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2">Clues:</h3>
        <ul className="space-y-1">
          {clues.map((clue, i) => (<li key={i} className="text-blue-800">
              {i + 1}. {clue}
            </li>))}
        </ul>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {grid.rows.map((person, i) => (<motion.div key={person} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">{person}</span>
              <div className="flex gap-2">
                {grid.cols.map((color) => (<button key={color} onClick={() => handleSelect(person, color)} className={`px-4 py-2 rounded-lg border-2 transition-all ${userSolution[person] === color
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'}`}>
                    {color}
                  </button>))}
              </div>
            </div>
          </motion.div>))}
      </div>

      {/* Submit */}
      <button onClick={() => onSubmit(userSolution)} disabled={!isComplete} className="btn-primary w-full max-w-xs mx-auto block disabled:opacity-50">
        Submit Answer
      </button>
    </div>);
};
