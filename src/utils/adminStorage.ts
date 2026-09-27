export interface AdminRecord {
  name: string;
  rollNo: string;
  approvedAt: string;
  role: 'super-admin' | 'admin';
}

export interface AdminRequest {
  id: string;
  name: string;
  rollNo: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ADMINS_KEY = 'rit_admins_v2';
const REQUESTS_KEY = 'rit_admin_requests_v2';

export const FIRST_ADMIN: AdminRecord = {
  name: 'Strange',
  rollNo: '200812200810',
  approvedAt: '2026-09-27T00:00:00.000Z',
  role: 'super-admin',
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function getAdmins(): AdminRecord[] {
  const admins = read<AdminRecord[]>(ADMINS_KEY, []);
  if (!admins.some(a => a.rollNo === FIRST_ADMIN.rollNo)) {
    const next = [FIRST_ADMIN, ...admins];
    localStorage.setItem(ADMINS_KEY, JSON.stringify(next));
    return next;
  }
  return admins;
}

export function authenticateAdmin(name: string, rollNo: string): AdminRecord | null {
  const normalizedName = name.trim().toLowerCase();
  const normalizedRoll = rollNo.trim();
  return getAdmins().find(a => a.name.trim().toLowerCase() === normalizedName && a.rollNo === normalizedRoll) || null;
}

export function getAdminRequests(): AdminRequest[] {
  return read<AdminRequest[]>(REQUESTS_KEY, []);
}

export function submitAdminRequest(name: string, rollNo: string, reason: string): AdminRequest {
  const request: AdminRequest = {
    id: `admin-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    rollNo: rollNo.trim(),
    reason: reason.trim() || 'Requested administrator access for the RIT digital campus.',
    requestedAt: new Date().toISOString(),
    status: 'pending',
  };
  const existing = getAdminRequests();
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([request, ...existing]));
  return request;
}

export function approveAdminRequest(id: string): AdminRecord | null {
  const requests = getAdminRequests();
  const request = requests.find(r => r.id === id);
  if (!request) return null;
  const admins = getAdmins();
  const admin: AdminRecord = {
    name: request.name,
    rollNo: request.rollNo,
    approvedAt: new Date().toISOString(),
    role: 'admin',
  };
  if (!admins.some(a => a.rollNo === admin.rollNo)) {
    localStorage.setItem(ADMINS_KEY, JSON.stringify([...admins, admin]));
  }
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r)));
  return admin;
}

export function rejectAdminRequest(id: string): void {
  const requests = getAdminRequests();
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r)));
}

const ADMIN_SESSION_KEY = 'rit_admin_session_v2';

export function getAdminSession(): AdminRecord | null {
  return read<AdminRecord | null>(ADMIN_SESSION_KEY, null);
}

export function saveAdminSession(admin: AdminRecord): void {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
