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
// Puzzle storage
export const savePuzzle = async (date, puzzleData) => {
    await puzzleStore.setItem(date, puzzleData);
};
export const getPuzzle = async (date) => {
    return await puzzleStore.getItem(date);
};
// Progress storage
export const saveProgress = async (date, progress) => {
    await progressStore.setItem(date, progress);
};
export const getProgress = async (date) => {
    return await progressStore.getItem(date);
};
export const getAllProgress = async () => {
    const keys = await progressStore.keys();
    const progress = [];
    for (const key of keys) {
        const item = await progressStore.getItem(key);
        if (item)
            progress.push(item);
    }
    return progress;
};
// Batch sync management
export const getPendingSyncScores = async () => {
    const allProgress = await getAllProgress();
    const lastSync = await settingsStore.getItem('lastSync');
    if (!lastSync)
        return allProgress;
    return allProgress.filter(p => new Date(p.lastUpdated) > new Date(lastSync));
};
export const markScoresSynced = async () => {
    await settingsStore.setItem('lastSync', new Date().toISOString());
};
// Settings storage
export const saveSetting = async (key, value) => {
    await settingsStore.setItem(key, value);
};
export const getSetting = async (key) => {
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
