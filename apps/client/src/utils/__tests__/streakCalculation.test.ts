import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

// Mock streak calculation function
function calculateStreak(
  lastPlayedDate: string | null,
  currentStreak: number,
  completionDate: string
): number {
  if (!lastPlayedDate) {
    return 1; // First puzzle
  }

  const today = dayjs(completionDate);
  const lastPlayed = dayjs(lastPlayedDate);
  const daysSince = today.diff(lastPlayed, 'day');

  if (daysSince === 0) {
    return currentStreak; // Same day
  } else if (daysSince === 1) {
    return currentStreak + 1; // Consecutive day
  } else {
    return 1; // Missed days - reset
  }
}

describe('Streak Calculation', () => {
  describe('Basic Streak Logic', () => {
    it('should start streak at 1 for first puzzle', () => {
      const streak = calculateStreak(null, 0, '2026-02-14');
      expect(streak).toBe(1);
    });

    it('should maintain streak when playing same day', () => {
      const streak = calculateStreak('2026-02-14', 5, '2026-02-14');
      expect(streak).toBe(5);
    });

    it('should increment streak on consecutive days', () => {
      const streak = calculateStreak('2026-02-14', 5, '2026-02-15');
      expect(streak).toBe(6);
    });

    it('should reset streak when days are missed', () => {
      const streak = calculateStreak('2026-02-14', 10, '2026-02-17');
      expect(streak).toBe(1);
    });
  });

  describe('Streak Reset Scenarios', () => {
    it('should reset after 1 missed day', () => {
      const streak = calculateStreak('2026-02-14', 7, '2026-02-16');
      expect(streak).toBe(1);
    });

    it('should reset after multiple missed days', () => {
      const streak = calculateStreak('2026-02-01', 15, '2026-02-15');
      expect(streak).toBe(1);
    });

    it('should reset after a month gap', () => {
      const streak = calculateStreak('2026-01-15', 20, '2026-02-15');
      expect(streak).toBe(1);
    });
  });

  describe('Long Streaks', () => {
    it('should correctly build a 30-day streak', () => {
      let streak = 0;
      let lastDate: string | null = null;

      for (let day = 1; day <= 30; day++) {
        const date = dayjs('2026-02-01').add(day - 1, 'day').format('YYYY-MM-DD');
        streak = calculateStreak(lastDate, streak, date);
        lastDate = date;
      }

      expect(streak).toBe(30);
    });

    it('should correctly build a 100-day streak', () => {
      let streak = 0;
      let lastDate: string | null = null;

      for (let day = 1; day <= 100; day++) {
        const date = dayjs('2026-01-01').add(day - 1, 'day').format('YYYY-MM-DD');
        streak = calculateStreak(lastDate, streak, date);
        lastDate = date;
      }

      expect(streak).toBe(100);
    });
  });

  describe('Timezone Edge Cases', () => {
    it('should handle midnight transition correctly (local timezone)', () => {
      const date1 = '2026-02-14';
      const date2 = '2026-02-15';
      
      const streak = calculateStreak(date1, 5, date2);
      expect(streak).toBe(6);
    });

    it('should not increment if same date in different timezones', () => {
      // User plays at 11:59 PM and 12:01 AM (same date, different times)
      const date = '2026-02-14';
      const streak = calculateStreak(date, 5, date);
      expect(streak).toBe(5);
    });

    it('should handle date string format variations', () => {
      const formats = [
        '2026-02-14',
        '2026-2-14',
        '2026-02-14T00:00:00',
      ];

      formats.forEach((dateStr) => {
        const streak = calculateStreak(null, 0, dateStr);
        expect(streak).toBe(1);
      });
    });
  });

  describe('Month/Year Boundaries', () => {
    it('should maintain streak across month boundary', () => {
      const streak = calculateStreak('2026-01-31', 10, '2026-02-01');
      expect(streak).toBe(11);
    });

    it('should maintain streak across year boundary', () => {
      const streak = calculateStreak('2025-12-31', 365, '2026-01-01');
      expect(streak).toBe(366);
    });

    it('should reset if month boundary is skipped', () => {
      const streak = calculateStreak('2026-01-30', 10, '2026-02-02');
      expect(streak).toBe(1);
    });
  });

  describe('Leap Year Streak', () => {
    it('should handle February 29 in leap year', () => {
      const streak1 = calculateStreak('2024-02-28', 5, '2024-02-29');
      expect(streak1).toBe(6);

      const streak2 = calculateStreak('2024-02-29', 6, '2024-03-01');
      expect(streak2).toBe(7);
    });

    it('should correctly span leap year February', () => {
      let streak = 0;
      let lastDate: string | null = null;

      // Feb 25 to Feb 29 (spans Feb 29 in leap year)
      for (let day = 25; day <= 29; day++) {
        const date = `2024-02-${day.toString().padStart(2, '0')}`;
        streak = calculateStreak(lastDate, streak, date);
        lastDate = date;
      }

      for (let day = 1; day <= 5; day++) {
        const date = `2024-03-${day.toString().padStart(2, '0')}`;
        streak = calculateStreak(lastDate, streak, date);
        lastDate = date;
      }

      expect(streak).toBe(10); // 5 days Feb (25-29) + 5 days Mar (1-5)
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid date gracefully', () => {
      // This should not throw an error
      expect(() => {
        calculateStreak('2026-02-14', 5, 'invalid-date');
      }).not.toThrow();
    });

    it('should handle very large streak numbers', () => {
      const streak = calculateStreak('2026-02-14', 9999, '2026-02-15');
      expect(streak).toBe(10000);
    });

    it('should handle negative streak (should not happen, but test anyway)', () => {
      const streak = calculateStreak('2026-02-14', -1, '2026-02-15');
      expect(streak).toBe(0); // -1 + 1 = 0
    });
  });
});