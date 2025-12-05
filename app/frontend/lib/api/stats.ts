// types/stats.ts
export interface DailyVisitDto {
  id: number;
  date: string;
  count: number;
}

export interface MonthlyVisitDto {
  id: number;
  month: string;
  total: number;
}

export interface GlobalStatsDto {
  id: number;
  totalVisitors: number;
}

export interface UsersCountDto {
  totalUsers: number;
}

export function getApiBase(ssr = false) {
  return ssr
    ? process.env.API_BASE_SSR
    : process.env.NEXT_PUBLIC_API_BASE;
}

// ------------------ Fonctions API sécurisées ------------------

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null; // retourne null si vide
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Erreur JSON.parse:', err, 'avec la réponse:', text);
    return null;
  }
}

export async function getCurrentMonthVisits(ssr = false) {
  const res = await fetch(`${getApiBase(ssr)}/stats/monthly/current`,)
  if (!res.ok) {
    const text = await res.text();
    console.error('Erreur API /stats/month:', text);
    throw new Error('Impossible de récupérer les visites du mois');
  }
  return safeJson(res);
}

export async function getDailyVisits(ssr = false): Promise<DailyVisitDto | null> {
  const res = await fetch(`${getApiBase(ssr)}/stats/daily/today`, {
    cache: ssr ? 'no-store' : 'default',
  });
  if (!res.ok) throw new Error('Impossible de récupérer les visites du jour');
  return safeJson(res);
}

export async function getGlobalStats(ssr = false): Promise<GlobalStatsDto | null> {
  const res = await fetch(`${getApiBase(ssr)}/stats/global`, {
    cache: ssr ? 'no-store' : 'default',
  });
  if (!res.ok)
    throw new Error('Impossible de récupérer les statistiques globales');
  return safeJson(res);
}

export async function recordVisit(ssr = false): Promise<{
  daily: DailyVisitDto | null;
  monthly: MonthlyVisitDto | null;
  global: GlobalStatsDto | null;
}> {
  const res = await fetch(`${getApiBase(ssr)}/stats/hit`, { method: 'POST' });
  if (!res.ok) throw new Error("Impossible d'enregistrer la visite");
  return safeJson(res);
}

export async function getTotalUsers(ssr = false): Promise<UsersCountDto | null> {
  const res = await fetch(`${getApiBase(ssr)}/user/count`, {
    cache: ssr ? 'no-store' : 'default',
  });
  if (!res.ok)
    throw new Error("Impossible de récupérer le nombre d'utilisateurs");
  return safeJson(res);
}

// ------------------ Fonction pour dashboard ------------------

export async function getStats(ssr = false) {
  const [daily, monthly, global] = await Promise.all([
    getDailyVisits(ssr),
    getCurrentMonthVisits(ssr),
    getGlobalStats(ssr),
  ]);

  return {
    daily: daily?.count ?? 0,
    monthly: monthly?.total ?? 0,
    global: global?.totalVisitors ?? 0,
  };
}
