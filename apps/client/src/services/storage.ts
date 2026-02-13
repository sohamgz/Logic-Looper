import localforage from 'localforage';

// Initialize IndexedDB stores
const puzzleStore = localforage.createInstance({
  name: 'LogicLooper',
  storeName: 'puzzles',
  description: 'Puzzle data and progress',
});

const progressStore = localforage.createInstance({
  name: 'LogicLooper',
  storeName: 'progress',
  description: 'User progress and scores',
});

const settingsStore = localforage.createInstance({
  name: 'LogicLooper',
  storeName: 'settings',
  description: 'User settings and preferences',
});

export interface DailyProgress {
  date: string;
  puzzleId: string;
  puzzleType: string;
  currentState: any;
  score: number;
  timeTaken: number;
  hintsUsed: number;
  completed: boolean;
  lastUpdated: string;
}

// Puzzle storage
export const savePuzzle = async (date: string, puzzleData: any) => {
  await puzzleStore.setItem(date, puzzleData);
};

export const getPuzzle = async (date: string) => {
  return await puzzleStore.getItem(date);
};

// Progress storage
export const saveProgress = async (date: string, progress: DailyProgress) => {
  await progressStore.setItem(date, progress);
};

export const getProgress = async (date: string): Promise<DailyProgress | null> => {
  return await progressStore.getItem(date);
};

export const getAllProgress = async (): Promise<DailyProgress[]> => {
  const keys = await progressStore.keys();
  const progress: DailyProgress[] = [];
  
  for (const key of keys) {
    const item = await progressStore.getItem<DailyProgress>(key);
    if (item) progress.push(item);
  }
  
  return progress;
};

// Batch sync management
export const getPendingSyncScores = async (): Promise<DailyProgress[]> => {
  const allProgress = await getAllProgress();
  const lastSync = await settingsStore.getItem<string>('lastSync');
  
  if (!lastSync) return allProgress;
  
  return allProgress.filter(p => 
    new Date(p.lastUpdated) > new Date(lastSync)
  );
};

export const markScoresSynced = async () => {
  await settingsStore.setItem('lastSync', new Date().toISOString());
};

// Settings storage
export const saveSetting = async (key: string, value: any) => {
  await settingsStore.setItem(key, value);
};

export const getSetting = async (key: string) => {
  return await settingsStore.getItem(key);
};

// Cleanup old data (keep last 30 days)
export const cleanupOldData = async () => {
  const keys = await progressStore.keys();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  
  for (const key of keys) {
    const date = new Date(key);
    if (date < cutoffDate) {
      await progressStore.removeItem(key);
      await puzzleStore.removeItem(key);
    }
  }
};