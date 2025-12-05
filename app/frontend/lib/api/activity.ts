export interface ActivityDto {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
}

// Gestion des URLs API

function getApiBase(ssr: boolean) {
  return ssr
    ? process.env.API_BASE_SSR || 'http://backend:3001/api'
    : process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
}

// GET Recent Activities
export async function getRecentActivities(
  limit?: number,
  ssr = false
): Promise<ActivityDto[]> {
  const query = new URLSearchParams();
  if (limit) query.append('limit', String(limit));

  const res = await fetch(
    `${getApiBase(ssr)}/activity/recent?${query.toString()}`,
    {
      method: 'GET',
      cache: ssr ? 'no-store' : 'default',
      credentials: ssr ? 'omit' : 'include',
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la récupération des activités récentes'
    );
  }

  return res.json();
}

// GET Activity by ID
export async function getActivityById(
  id: string,
  ssr = false
): Promise<ActivityDto> {
  const res = await fetch(`${getApiBase(ssr)}/activity/${id}`, {
    method: 'GET',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Activité non trouvée');
  return res.json();
}
