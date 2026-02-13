import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  sequence: string[];
  options: string[];
  onSubmit: (answer: string) => void;
}

export const PatternPuzzle = ({ sequence, options, onSubmit }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Sequence Display */}
      <div className="flex flex-wrap justify-center gap-3">
        {sequence.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-lg border-2 border-gray-300 shadow-sm"
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(option)}
            className={`
              w-full h-16 text-4xl rounded-lg border-2 transition-all
              ${selected === option
                ? 'bg-primary-100 border-primary-500 shadow-lg'
                : 'bg-white border-gray-300 hover:border-primary-300'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => selected && onSubmit(selected)}
        disabled={!selected}
        className="btn-primary w-full max-w-xs mx-auto block disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
};