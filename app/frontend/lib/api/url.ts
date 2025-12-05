// app/frontend/lib/api/url.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // doit être http://localhost:3001

function getBaseUrl(): string {
  if (!BASE_URL) {
    throw new Error('La variable d’environnement API n’est pas définie.');
  }
  return BASE_URL.replace(/\/$/, '');
}

export function apiUrl(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${getBaseUrl()}/api/${cleanPath}`;
}
