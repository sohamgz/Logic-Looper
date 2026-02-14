import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '@store/index';
import { loadTodaysPuzzle, submitAnswer, useHint } from '@store/puzzleSlice';
import { MatrixPuzzle } from '@components/game/MatrixPuzzle';
import { PatternPuzzle } from '@components/game/PatternPuzzle';
import { BinaryPuzzle } from '@components/game/BinaryPuzzle';
import { SequencePuzzle } from '@components/game/SequencePuzzle';
import { DeductionPuzzle } from '@components/game/DeductionPuzzle';


export const GameScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPuzzle, gameState, isLoading } = useSelector((state: RootState) => state.puzzle);
  const { currentStreak } = useSelector((state: RootState) => state.streak);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    dispatch(loadTodaysPuzzle());
  }, [dispatch]);
  
  useEffect(() => {
    if (gameState && !gameState.isComplete) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - gameState.startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleSubmit = async (answer: any) => {
    const result = await dispatch(submitAnswer(answer));
    if (submitAnswer.fulfilled.match(result) && result.payload.isCorrect) {
      // Answer is correct - Redux will update gameState.isComplete
      console.log('Correct answer!');
    } else {
      // Wrong answer
      alert('Incorrect! Try again.');
    }
  };

  const handleUseHint = () => {
    dispatch(useHint());
    alert('Hint: Check the rules carefully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today's puzzle...</p>
        </div>
      </div>
    );
  }

  if (!currentPuzzle || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No puzzle available</p>
          <p className="text-sm text-gray-500 mt-2">Check console for errors</p>
        </div>
      </div>
    );
  }

if (gameState.isComplete) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center max-w-md"
      >
        <div className="text-6xl mb-4">Congrates</div>
        <h2 className="text-3xl font-bold text-green-700 mb-2">Puzzle Complete!</h2>
        <p className="text-gray-600 mb-4">Great job solving today's puzzle!</p>
        
        {/* Stats */}
        <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Score:</span>
            <span className="text-primary-600 font-bold">{gameState.score} points</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Time:</span>
            <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Hints Used:</span>
            <span>{gameState.hintsUsed}</span>
          </div>
        </div>

        {/* Streak Info */}
        <div className="mt-4 bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-700">
            {currentStreak} Day Streak!
          </div>
          <p className="text-sm text-orange-600 mt-1">
            Keep playing daily to maintain your streak
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-4">Come back tomorrow for a new puzzle!</p>
      </motion.div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-700">{currentPuzzle.title}</h1>
              <p className="text-gray-600 text-sm">{currentPuzzle.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-500">
                Hints: {gameState.hintsUsed}/{currentPuzzle.maxHints}
              </div>
            </div>
          </div>
        </div>

        {/* Puzzle Content */}
        <div className="card">
          {currentPuzzle.type === 'matrix' && (
            <MatrixPuzzle
              grid={currentPuzzle.grid}
              solution={currentPuzzle.solution}
              onSubmit={handleSubmit}
            />
          )}

          {currentPuzzle.type === 'pattern' && (
            <PatternPuzzle
              sequence={currentPuzzle.sequence}
              options={currentPuzzle.options}
              onSubmit={handleSubmit}
            />
          )}

          {currentPuzzle.type === 'sequence' && (
            <SequencePuzzle
              numbers={currentPuzzle.numbers}
              solution={currentPuzzle.solution}
              onSubmit={handleSubmit}
            />
          )}

          {currentPuzzle.type === 'deduction' && (
            <DeductionPuzzle
              clues={currentPuzzle.clues}
              grid={currentPuzzle.grid}
              solution={currentPuzzle.solution}
              onSubmit={handleSubmit}
            />
          )}

          {currentPuzzle.type === 'binary' && (
            <BinaryPuzzle
              gates={currentPuzzle.gates}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Hint Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleUseHint}
            disabled={gameState.hintsUsed >= currentPuzzle.maxHints}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💡 Use Hint ({currentPuzzle.maxHints - gameState.hintsUsed} left)
          </button>
        </div>
      </div>
    </div>
  );
};