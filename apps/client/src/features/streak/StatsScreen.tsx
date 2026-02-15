import { ShareStreak } from '@components/streak/ShareStreak';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@store/index';
import { Heatmap } from '@components/common/Heatmap';

export const StatsScreen = () => {
  const { currentStreak, longestStreak, playedDates } = useSelector(
    (state: RootState) => state.streak
  );
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-4">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Streak Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-5xl font-bold text-primary-600 mb-2">
              {currentStreak}
            </div>
            <div className="text-gray-600 font-semibold">
              Current Streak
            </div>
            <div className="text-sm text-gray-500 mt-1">
              days in a row
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-5xl font-bold text-green-600 mb-2">
              {longestStreak}
            </div>
            <div className="text-gray-600 font-semibold">
              Longest Streak
            </div>
            <div className="text-sm text-gray-500 mt-1">
              personal best
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {playedDates.length}
            </div>
            <div className="text-gray-600 font-semibold">
              Total Puzzles
            </div>
            <div className="text-sm text-gray-500 mt-1">
              all time
            </div>
          </motion.div>
        </div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Activity in the Last Year
          </h2>
          <Heatmap playedDates={playedDates} />
        </motion.div>

        {/* Share Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <ShareStreak
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalPuzzles={playedDates.length}
            userName={user?.name || 'User'}
          />
        </motion.div>

      </div>
    </div>
  );
};
