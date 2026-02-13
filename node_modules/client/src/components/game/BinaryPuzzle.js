import { useState } from 'react';
import { motion } from 'framer-motion';
export const BinaryPuzzle = ({ gates, onSubmit }) => {
    const [answers, setAnswers] = useState(gates.map(() => false));
    const toggleAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers[index] = !newAnswers[index];
        setAnswers(newAnswers);
    };
    const getGateSymbol = (gate) => {
        const symbols = {
            AND: '∧',
            OR: '∨',
            XOR: '⊕',
            NOT: '¬',
            NAND: '⊼',
            NOR: '⊽',
        };
        return symbols[gate] || gate;
    };
    return (<div className="space-y-6">
      {/* Gates Display */}
      <div className="space-y-4">
        {gates.map((gate, i) => (<motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              {/* Inputs */}
              <div className="flex gap-2">
                {gate.inputs.map((input, j) => (<div key={j} className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${input ? 'bg-green-500' : 'bg-red-500'}`}>
                    {input ? '1' : '0'}
                  </div>))}
              </div>

              {/* Gate Symbol */}
              <div className="text-3xl font-bold text-primary-700 mx-4">
                {getGateSymbol(gate.gate)}
              </div>
              <div className="text-sm text-gray-600">{gate.gate}</div>

              {/* Arrow */}
              <div className="text-2xl text-gray-400 mx-4">→</div>

              {/* Output Selection */}
              <button onClick={() => toggleAnswer(i)} className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-white text-2xl transition-all ${answers[i] ? 'bg-green-500' : 'bg-red-500'}`}>
                {answers[i] ? '1' : '0'}
              </button>
            </div>
          </motion.div>))}
      </div>

      {/* Submit Button */}
      <button onClick={() => onSubmit(answers)} className="btn-primary w-full max-w-xs mx-auto block">
        Submit Answer
      </button>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-semibold mb-2">Logic Gate Quick Reference:</p>
        <ul className="space-y-1 text-gray-700">
          <li><strong>AND:</strong> Output is 1 only if ALL inputs are 1</li>
          <li><strong>OR:</strong> Output is 1 if ANY input is 1</li>
          <li><strong>XOR:</strong> Output is 1 if inputs are DIFFERENT</li>
        </ul>
      </div>
    </div>);
};
