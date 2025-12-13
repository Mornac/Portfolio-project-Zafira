// lib/api/upload.ts
import {getBrowserApiBase} from './url';

export interface UploadedFileEntity {
  originalName: string;
  fileName: string;
  path: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string; // ISO string
}
const API_BASE = getBrowserApiBase();

export async function uploadFile(file: File): Promise<UploadedFileEntity> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/uploads`, {
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
