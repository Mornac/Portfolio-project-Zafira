import {getBrowserApiBase} from './url';

export interface CreateActionDto {
  title: string;
  description: string;
  imageUrl?: string;
  published?: boolean;
}

export interface ActionDto {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  published: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = getBrowserApiBase();

// create
export async function createAction(action: CreateActionDto) {
  const res = await fetch(`${API_BASE}/actions`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify(action),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Erreur lors de la création de l’action');
  }
  return res.json();
}

// GET one by ID
export async function getActionById(id: string): Promise<ActionDto> {
  const res = await fetch(`${API_BASE}/actions/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Erreur lors de la récupération de l’action ${id}`);
  }

  return res.json();
}

// GET all
export async function getActions(): Promise<ActionDto[]> {
  const res = await fetch(`${API_BASE}/actions`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erreur lors de la récupération des actions');
  return res.json();
}

// PATCH partial update
export async function patchAction(id: string, dto: Partial<CreateActionDto>) {
  const res = await fetch(`${API_BASE}/actions/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la mise à jour de l’action'
    );
  }
  return res.json();
}

// DELETE
export async function deleteAction(id: string) {
  const res = await fetch(`${API_BASE}/actions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la suppression de l’action'
    );
  }
  return res.json();
}
