// ----------------------------
// DTOs (Data Transfer Objects)
// ----------------------------

export interface CreateTestimonialDto {
  content: string;
  published?: boolean;
  publishedAt?: string;
  validated?: boolean;
}

export interface UpdateTestimonialDto {
  content?: string;
  validated?: boolean;
  published?: boolean;
}

export interface TestimonialDto {
  id: string;
  authorName: string;
  content: string;
  beneficiaryId?: string | null;
  validated: boolean;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
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
// CREATE Testimonial
// ----------------------------
export async function createTestimonial(
  testimonial: CreateTestimonialDto,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify(testimonial),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la création du témoignage'
    );
  }
  return res.json();
}

// ----------------------------
// GET All Testimonials
// (avec filtres optionnels)
// ----------------------------
export async function getTestimonials(
  options?: {limit?: number; published?: boolean; validated?: boolean},
  ssr = false
): Promise<TestimonialDto[]> {
  const query = new URLSearchParams();

  if (options?.limit) query.append('limit', String(options.limit));
  if (options?.published !== undefined)
    query.append('published', String(options.published));
  if (options?.validated !== undefined)
    query.append('validated', String(options.validated));

  const res = await fetch(
    `${getApiBase(ssr)}/testimonials?${query.toString()}`,
    {
      method: 'GET',
      cache: ssr ? 'no-store' : 'default',
      credentials: ssr ? 'omit' : 'include',
    }
  );

  if (!res.ok)
    throw new Error('Erreur lors de la récupération des témoignages');
  return res.json();
}

// ----------------------------
// GET Testimonial by ID
// ----------------------------
export async function getTestimonialById(
  id: string,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}`, {
    method: 'GET',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Témoignage non trouvé');
  return res.json();
}

// ----------------------------
// GET Testimonials of the logged-in beneficiary
// ----------------------------
export async function getMyTestimonials(ssr = false): Promise<TestimonialDto[]> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/my`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok)
    throw new Error('Erreur lors de la récupération de vos témoignages');
  return res.json();
}


// ----------------------------
// PATCH (mise à jour partielle)
// ----------------------------
export async function patchTestimonial(
  id: string,
  dto: UpdateTestimonialDto,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    credentials: ssr ? 'omit' : 'include',
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la mise à jour du témoignage'
    );
  }
  return res.json();
}

// ----------------------------
// DELETE Testimonial
// ----------------------------
export async function deleteTestimonial(id: string, ssr = false) {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}`, {
    method: 'DELETE',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || 'Erreur lors de la suppression du témoignage'
    );
  }
  return res.json();
}

// ----------------------------
// VALIDATE / UNVALIDATE
// ----------------------------
export async function validateTestimonial(
  id: string,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}/validate`, {
    method: 'PATCH',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Erreur lors de la validation du témoignage');
  return res.json();
}

export async function unvalidateTestimonial(
  id: string,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}/unvalidate`, {
    method: 'PATCH',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Erreur lors de la dévalidation du témoignage');
  return res.json();
}

// ----------------------------
// PUBLISH / UNPUBLISH
// ----------------------------
export async function publishTestimonial(
  id: string,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}/publish`, {
    method: 'PATCH',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Erreur lors de la publication du témoignage');
  return res.json();
}

export async function unpublishTestimonial(
  id: string,
  ssr = false
): Promise<TestimonialDto> {
  const res = await fetch(`${getApiBase(ssr)}/testimonials/${id}/unpublish`, {
    method: 'PATCH',
    credentials: ssr ? 'omit' : 'include',
  });

  if (!res.ok) throw new Error('Erreur lors de la dépublication du témoignage');
  return res.json();
}
