// Types
export interface ManualStatisticDto {
  id: string;
  type: 'BENEFICIARIES' | 'CLOTHES_KG' | 'WORKSHOPS';
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
  entries?: ManualStatisticEntryDto[];
}

export interface ManualStatisticEntryDto {
  id: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  manualStatisticId: string;
}

export interface CreateManualStatisticEntryDto {
  quantity: number;
}

export interface UpdateManualStatisticEntryDto {
  quantity?: number;
}

// Base URL Helper
function getApiBase(ssr = false) {
  return ssr
    ? process.env.API_BASE_SSR || 'http://backend:3001/api'
    : process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
}

// GET all manual stats
export async function getManualStats(
  ssr = false
): Promise<ManualStatisticDto[]> {
  const res = await fetch(`${getApiBase(ssr)}/manual-stats`, {
    method: 'GET',
    cache: ssr ? 'no-store' : 'default',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok)
    throw new Error('Erreur lors de la récupération des statistiques');
  return res.json();
}

// GET manual stat by ID
export async function getManualStatById(
  id: string,
  ssr = false
): Promise<ManualStatisticDto> {
  const res = await fetch(`${getApiBase(ssr)}/manual-stats/${id}`, {
    method: 'GET',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Statistique non trouvée');
  return res.json();
}

// GET manual stat by TYPE
export async function getManualStatByType(
  type: ManualStatisticDto['type'],
  ssr = false
): Promise<ManualStatisticDto> {
  const res = await fetch(`${getApiBase(ssr)}/manual-stats/type/${type}`, {
    method: 'GET',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Statistique non trouvée');
  return res.json();
}

// POST: Add entry (increment stat)
export async function addManualStatEntry(
  id: string,
  dto: CreateManualStatisticEntryDto,
  ssr = false
): Promise<ManualStatisticEntryDto> {
  const res = await fetch(`${getApiBase(ssr)}/manual-stats/${id}/entries`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: ssr ? 'omit' : 'include',
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Erreur lors de l'ajout d'une entrée");
  }

  return res.json();
}

// PATCH: Update specific entry
export async function updateManualStatEntry(
  id: string,
  entryId: string,
  dto: UpdateManualStatisticEntryDto,
  ssr = false
): Promise<ManualStatisticEntryDto> {
  const res = await fetch(
    `${getApiBase(ssr)}/manual-stats/${id}/entries/${entryId}`,
    {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      credentials: ssr ? 'omit' : 'include',
      body: JSON.stringify(dto),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || "Erreur lors de la mise à jour de l'entrée"
    );
  }

  return res.json();
}

// DELETE: Remove entry
export async function deleteManualStatEntry(
  id: string,
  entryId: string,
  ssr = false
): Promise<{success: boolean}> {
  const res = await fetch(
    `${getApiBase(ssr)}/manual-stats/${id}/entries/${entryId}`,
    {
      method: 'DELETE',
      credentials: ssr ? 'omit' : 'include',
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || "Erreur lors de la suppression de l'entrée"
    );
  }
  return {success: true};
}

