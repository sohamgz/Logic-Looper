import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

interface Props {
  playedDates: string[];
}

export const Heatmap = ({ playedDates }: Props) => {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const yearStart = useMemo(
    () => dayjs(`${selectedYear}-01-01`),
    [selectedYear]
  );

  const yearEnd = useMemo(
    () => dayjs(`${selectedYear}-12-31`),
    [selectedYear]
  );

  // Start from first Sunday before or equal to Jan 1
  const gridStart = yearStart.startOf('week');

  // End at last Saturday after or equal to Dec 31
  const gridEnd = yearEnd.endOf('week');

  const totalDays = gridEnd.diff(gridStart, 'day') + 1;

  const allDays = useMemo(() => {
    const arr: {
      date: string;
      played: boolean;
      inCurrentYear: boolean;
    }[] = [];

    for (let i = 0; i < totalDays; i++) {
      const date = gridStart.add(i, 'day');
      const formatted = date.format('YYYY-MM-DD');

      arr.push({
        date: formatted,
        played: playedDates.includes(formatted),
        inCurrentYear: date.year() === selectedYear,
      });
    }

    return arr;
  }, [gridStart, totalDays, playedDates, selectedYear]);

  // Group into weeks (columns)
  const weeks = useMemo(() => {
    const result: typeof allDays[] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      result.push(allDays.slice(i, i + 7));
    }
    return result;
  }, [allDays]);

  const getColor = (played: boolean, inYear: boolean) => {
    if (!inYear) return 'bg-transparent';
    return played
      ? 'bg-green-500 hover:bg-green-600'
      : 'bg-gray-200 hover:bg-gray-300';
  };

  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  const thisYearCount = playedDates.filter(
    (d) => dayjs(d).year() === selectedYear
  ).length;

  const completion = Math.round(
    (thisYearCount /
      (yearEnd.diff(yearStart, 'day') + 1)) *
      100
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Activity Calendar
        </h3>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* GitHub Style Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  whileHover={{ scale: 1.15 }}
                  title={`${day.date}${
                    day.played ? ' - Completed ✅' : ''
                  }`}
                  className={`w-3 h-3 rounded-sm transition-all ${getColor(
                    day.played,
                    day.inCurrentYear
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">
            {thisYearCount} days active
          </span>
          <span className="text-gray-500">
            {completion}% completion
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded-sm" />
            <div className="w-4 h-4 bg-green-200 rounded-sm" />
            <div className="w-4 h-4 bg-green-400 rounded-sm" />
            <div className="w-4 h-4 bg-green-500 rounded-sm" />
            <div className="w-4 h-4 bg-green-600 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
