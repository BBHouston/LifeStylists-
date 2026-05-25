import type { Scholarship } from './types';

const KEY = 'scholarships_v1';

export function loadScholarships(): Scholarship[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScholarships(list: Scholarship[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addScholarship(s: Scholarship): void {
  const list = loadScholarships();
  saveScholarships([...list, s]);
}

export function updateScholarship(updated: Scholarship): void {
  const list = loadScholarships();
  saveScholarships(list.map(s => s.id === updated.id ? updated : s));
}

export function deleteScholarship(id: string): void {
  saveScholarships(loadScholarships().filter(s => s.id !== id));
}

export function getUrgency(deadline: string): import('./types').UrgencyLevel {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (days <= 7)  return 'critical';
  if (days <= 14) return 'high';
  if (days <= 30) return 'medium';
  return 'low';
}

export function getDaysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}
