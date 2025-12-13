// Centralise la construction des URLs API côté front
const DEFAULT_API_BASE = 'http://localhost:3001/api';

export function getBrowserApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_API_BASE;
  return base.replace(/\/$/, '');
}

export function getBrowserApiOrigin(): string {
  const base = getBrowserApiBase();
  try {
    return new URL(base).origin;
  } catch {
    return base.replace(/\/api$/, '');
  }
}

export function apiUrl(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${getBrowserApiBase()}/${cleanPath}`;
}
