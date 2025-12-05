// lib/api/user.ts

export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

const API_BASE = 'http://localhost:3001/api';

// GET all users
export async function getUsers(): Promise<UserDto[]> {
  const res = await fetch(`${API_BASE}/user`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  return res.json();
}

// GET user by ID
export async function getUserById(id: string): Promise<UserDto> {
  const res = await fetch(`${API_BASE}/user/by-id/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Utilisateur non trouvé');
  return res.json();
}

// DELETE user
export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/user/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la suppression de l’utilisateur'
    );
  }
  return res.json();
}

// PATCH/PUT user
export async function updateUser(
  id: string,
  dto: Partial<Pick<UserDto, 'firstName' | 'lastName' | 'email'>> & {
    password?: string;
  }
): Promise<UserDto> {
  const res = await fetch(`${API_BASE}/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la mise à jour de l’utilisateur'
    );
  }

  return res.json();
}
