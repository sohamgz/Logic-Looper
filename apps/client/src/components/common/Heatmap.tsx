import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(isLeapYear);
import { useState } from 'react';

interface Props {
  playedDates: string[];
}

export const Heatmap = ({ playedDates }: Props) => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  
  // Generate days for selected year
  const startDate = dayjs().year(selectedYear).startOf('year');
  const isLeapYear = dayjs().year(selectedYear).isLeapYear();
  const totalDays = isLeapYear ? 366 : 365;
  
  const days: { date: string; played: boolean }[] = [];
  
  for (let i = 0; i < totalDays; i++) {
    const date = startDate.add(i, 'day');
    days.push({
      date: date.format('YYYY-MM-DD'),
      played: playedDates.includes(date.format('YYYY-MM-DD')),
    });
  }

  // Group by weeks (7 days per column)
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get color based on activity
  const getColor = (played: boolean) => {
    return played ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300';
  };

  // Get available years (current year and past 2 years)
  const currentYear = dayjs().year();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div>
      {/* Year Selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity Calendar</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  whileHover={{ scale: 1.2 }}
                  title={`${day.date}${day.played ? ' - Completed! ✅' : ' - Not played'}`}
                  className={`w-3 h-3 rounded-sm ${getColor(day.played)} transition-all cursor-pointer`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Activity Level</span>
          <span className="text-xs text-gray-500">{playedDates.length} days active</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Less</span>
          
          {/* Gradient boxes */}
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded-sm border border-gray-300" title="No activity"></div>
            <div className="w-4 h-4 bg-green-200 rounded-sm border border-green-300" title="Low activity"></div>
            <div className="w-4 h-4 bg-green-400 rounded-sm border border-green-500" title="Medium activity"></div>
            <div className="w-4 h-4 bg-green-500 rounded-sm border border-green-600" title="High activity"></div>
            <div className="w-4 h-4 bg-green-600 rounded-sm border border-green-700" title="Very high activity"></div>
          </div>
          
          <span className="text-xs text-gray-600">More</span>
        </div>

        {/* Stats Summary */}
        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-primary-600">{playedDates.length}</div>
            <div className="text-xs text-gray-600">Total Days</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {Math.round((playedDates.length / totalDays) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Completion</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {playedDates.filter(d => dayjs(d).year() === selectedYear).length}
            </div>
            <div className="text-xs text-gray-600">This Year</div>
          </div>
        </div>
      </div>
    </div>
  );
};