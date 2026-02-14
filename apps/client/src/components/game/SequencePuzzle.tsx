import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  numbers: (number | null)[];
  solution: number[];
  onSubmit: (answer: number[]) => void;
}

export const SequencePuzzle = ({ numbers, solution, onSubmit }: Props) => {
  const [userAnswer, setUserAnswer] = useState<string>('');

  const handleSubmit = () => {
    const answer = userAnswer
      .split(',')
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n));

    onSubmit(answer);
  };

  return (
    <div className="space-y-6">
      {/* Sequence Display */}
      <div className="flex flex-wrap justify-center gap-3">
        {numbers.map((num, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg border-2 ${
              num === null
                ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            {num === null ? '?' : num}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="max-w-md mx-auto">
        <label
          htmlFor="sequence-answer"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Enter the missing number(s) (comma-separated if multiple):
        </label>

        <input
          id="sequence-answer"
          name="sequenceAnswer"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="e.g., 8 or 8, 16"
          autoComplete="off"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!userAnswer.trim()}
        className="btn-primary w-full max-w-xs mx-auto block disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
};
