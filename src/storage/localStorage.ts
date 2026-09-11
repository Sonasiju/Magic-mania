export interface PlayerProgress {
  unlockedLevel: number;
  highScore: number;
  totalCoins: number;
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  settings: {
    soundVolume: number;
    musicVolume: number;
    muted: boolean;
  };
}

const STORAGE_KEY = 'MAGNET_MANIA_SAVE_DATA';

const defaultProgress: PlayerProgress = {
  unlockedLevel: 1,
  highScore: 0,
  totalCoins: 0,
  levelStars: { 1: 0 },
  settings: {
    soundVolume: 0.8,
    musicVolume: 0.6,
    muted: false
  }
};

export const StorageManager = {
  loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultProgress;
      return { ...defaultProgress, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Failed to load local storage progress, using defaults', e);
      return defaultProgress;
    }
  },

  saveProgress(progress: Partial<PlayerProgress>): PlayerProgress {
    try {
      const current = this.loadProgress();
      const updated = { ...current, ...progress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save to local storage', e);
      return defaultProgress;
    }
  },

  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
