// lib/api/partner.ts

// ----------------------------
// Interfaces
// ----------------------------
export interface CreatePartnerDto {
  companyName: string;
  logoUrl: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface PartnerDto {
  id: string;
  companyName: string;
  logoUrl: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ----------------------------
// Gestion des URLs API
// ----------------------------
function getApiBase(ssr: boolean) {
  return ssr
    ? process.env.API_BASE_SSR || 'http://backend:3001/api'
    : process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
}

// ----------------------------
// CREATE Partner
// ----------------------------
export async function createPartner(
  partner: CreatePartnerDto,
  ssr = false
): Promise<PartnerDto> {
  const res = await fetch(`${getApiBase(ssr)}/partners`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: ssr ? 'omit' : 'include',
    body: JSON.stringify(partner),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la création du partenaire'
    );
  }

  return res.json();
}

// ----------------------------
// GET All Partners
// ----------------------------
export async function getPartners(ssr = false): Promise<PartnerDto[]> {
  const res = await fetch(`${getApiBase(ssr)}/partners`, {
    method: 'GET',
    cache: ssr ? 'no-store' : 'default',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok)
    throw new Error('Erreur lors de la récupération des partenaires');

  return res.json();
}

// ----------------------------
// GET Partner by ID
// ----------------------------
export async function getPartnerById(
  id: string,
  ssr = false
): Promise<PartnerDto> {
  const res = await fetch(`${getApiBase(ssr)}/partners/${id}`, {
    method: 'GET',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Partenaire non trouvé');
  return res.json();
}

// ----------------------------
// UPDATE Partner (PUT)
// ----------------------------
export async function updatePartner(
  id: string,
  dto: Partial<CreatePartnerDto>,
  ssr = false
): Promise<PartnerDto> {
  const res = await fetch(`${getApiBase(ssr)}/partners/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    credentials: ssr ? 'omit' : 'include',
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la mise à jour du partenaire'
    );
  }

  return res.json();
}

// ----------------------------
// DELETE Partner
// ----------------------------
export async function deletePartner(id: string, ssr = false) {
  const res = await fetch(`${getApiBase(ssr)}/partners/${id}`, {
    method: 'DELETE',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la suppression du partenaire'
    );
  }

  return res.json();
}
