import localforage from 'localforage';
import { markScoresSynced } from './storage';

export interface ScoreData {
  date: string;
  score: number;
  timeTaken: number;
  difficulty: string;
  puzzleType: string;
  userAnswer: any;
  hintsUsed: number;
}

interface PendingSync extends ScoreData {
  createdAt: string;
  retryCount: number;
}

// Initialize IndexedDB store for pending syncs
const pendingSyncStore = localforage.createInstance({
  name: 'LogicLooper',
  storeName: 'pendingSync',
  description: 'Pending score syncs to server',
});

class SyncManager {
  private static instance: SyncManager;
  private syncInProgress = false;
  private API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  private constructor() {}

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Add a score to the pending sync queue
   */
  async addPendingSync(scoreData: ScoreData): Promise<void> {
    try {
      const id = `${scoreData.date}_${Date.now()}`;

      const payload: PendingSync = {
        ...scoreData,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };

      await pendingSyncStore.setItem<PendingSync>(id, payload);

      console.log('Score added to sync queue:', id);
    } catch (error) {
      console.error('Error adding to sync queue:', error);
      throw error;
    }
  }

  /**
   * Get all pending syncs
   */
  async getPendingSyncs(): Promise<PendingSync[]> {
    try {
      const keys = await pendingSyncStore.keys();

      const syncs: PendingSync[] = [];

      for (const key of keys) {
        const item = await pendingSyncStore.getItem<PendingSync>(key);

        if (item) {
          syncs.push(item);
        }
      }

      return syncs;
    } catch (error) {
      console.error('Error getting pending syncs:', error);
      return [];
    }
  }

  /**
   * Sync a single score to the server
   */
  async syncScoreToServer(
    scoreData: ScoreData,
    authToken: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        console.error('Server error:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error syncing score:', error);
      return false;
    }
  }

  /**
   * Sync all pending scores to the server
   */
  async syncToServer(
    authToken: string
  ): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    const result = { success: 0, failed: 0 };

    try {
      const pendingSyncs = await this.getPendingSyncs();

      if (pendingSyncs.length === 0) {
        console.log('No pending syncs');
        return result;
      }

      for (const sync of pendingSyncs) {
        const { createdAt, retryCount, ...scoreData } = sync;

        const success = await this.syncScoreToServer(
          scoreData,
          authToken
        );

        const key = `${scoreData.date}_${new Date(
          createdAt
        ).getTime()}`;

        if (success) {
          await pendingSyncStore.removeItem(key);
          result.success++;
        } else {
          if (retryCount < 3) {
            await pendingSyncStore.setItem<PendingSync>(key, {
              ...sync,
              retryCount: retryCount + 1,
            });
          }
          result.failed++;
        }
      }

      if (result.failed === 0) {
        await markScoresSynced();
      }

      console.log('Sync complete:', result);
    } catch (error) {
      console.error('Sync manager error:', error);
    } finally {
      this.syncInProgress = false;
    }

    return result;
  }

  /**
   * Clear all pending syncs
   */
  async clearPendingSyncs(): Promise<void> {
    try {
      await pendingSyncStore.clear();
      console.log('Pending syncs cleared');
    } catch (error) {
      console.error('Error clearing pending syncs:', error);
      throw error;
    }
  }

  /**
   * Auto-sync when connection is restored
   */
  setupAutoSync(authToken: string): void {
    window.addEventListener('online', async () => {
      console.log('Connection restored, attempting sync...');
      await this.syncToServer(authToken);
    });
  }
}

export const syncManager = SyncManager.getInstance();
