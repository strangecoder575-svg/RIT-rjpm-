import { StudentUser } from '../types/user';

const GLOBAL_XP_KEY = 'rit_xp';

function userKey(user: StudentUser): string {
  const identity = (user.rollNo || user.name).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `rit_xp_${identity}`;
}

export function getUserXp(user?: StudentUser | null): number {
  if (typeof window === 'undefined') return 0;
  const key = user ? userKey(user) : GLOBAL_XP_KEY;
  const value = Number(localStorage.getItem(key));
  if (Number.isFinite(value) && value >= 0) return value;
  // Keep the old prototype XP as a one-time starting value for the first signed-in user.
  if (user && !localStorage.getItem(key)) {
    const legacy = Number(localStorage.getItem(GLOBAL_XP_KEY));
    return Number.isFinite(legacy) && legacy > 0 ? legacy : 0;
  }
  return 0;
}

export function setUserXp(user: StudentUser, xp: number): number {
  const safe = Math.max(0, Math.round(xp));
  localStorage.setItem(userKey(user), String(safe));
  window.dispatchEvent(new CustomEvent('rit:xp-change'));
  return safe;
}

export function addUserXp(user: StudentUser, amount: number): number {
  return setUserXp(user, getUserXp(user) + amount);
}

export function getAllStoredXp(): number {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith('rit_xp_')) total += Number(localStorage.getItem(key) || 0);
  }
  return total;
}
