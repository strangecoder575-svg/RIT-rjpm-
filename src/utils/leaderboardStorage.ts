import { LeaderboardEntry, INITIAL_LEADERBOARD } from '../types/leaderboard';

const STORAGE_KEY = 'rit_quiz_global_leaderboard';

export function getLeaderboardEntries(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return INITIAL_LEADERBOARD;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
      return INITIAL_LEADERBOARD;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return sortEntries(parsed);
    }
    return INITIAL_LEADERBOARD;
  } catch (err) {
    console.error('Error reading leaderboard from localStorage', err);
    return INITIAL_LEADERBOARD;
  }
}

export function saveLeaderboardEntry(newEntry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
  const current = getLeaderboardEntries();
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const entry: LeaderboardEntry = {
    ...newEntry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    date: dateStr
  };

  const updated = sortEntries([entry, ...current]);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving leaderboard to localStorage', err);
  }
  return updated;
}

export function resetLeaderboardToDefault(): LeaderboardEntry[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
  } catch (err) {
    console.error('Error resetting leaderboard', err);
  }
  return INITIAL_LEADERBOARD;
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    // 1. Percentage / score ratio
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    // 2. Absolute score
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 3. Time taken (lower time is better rank)
    return a.timeTaken - b.timeTaken;
  });
}
