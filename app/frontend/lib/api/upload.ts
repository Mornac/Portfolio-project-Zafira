// lib/api/upload.ts
export interface UploadedFileEntity {
  originalName: string;
  fileName: string;
  path: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string; // ISO string
}

export async function uploadFile(file: File): Promise<UploadedFileEntity> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('http://localhost:3001/api/uploads', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erreur lors de l’upload du fichier');
  }

  return res.json();
}
