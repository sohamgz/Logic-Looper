import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface Props {
  playedDates: string[];
}

export const Heatmap = ({ playedDates }: Props) => {
  // Generate last 365 days
  const today = dayjs();
  const startDate = today.subtract(364, 'day');
  
  const days: { date: string; played: boolean }[] = [];
  
  for (let i = 0; i < 365; i++) {
    const date = startDate.add(i, 'day');
    days.push({
      date: date.format('YYYY-MM-DD'),
      played: playedDates.includes(date.format('YYYY-MM-DD')),
    });
  }

  // Group by weeks
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (played: boolean) => {
    return played ? 'bg-green-500' : 'bg-gray-200';
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <motion.div
                key={day.date}
                whileHover={{ scale: 1.2 }}
                title={`${day.date}${day.played ? ' - Completed!' : ''}`}
                className={`w-3 h-3 rounded-sm ${getColor(day.played)} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
};