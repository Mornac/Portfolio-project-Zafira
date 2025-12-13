'use client';

import * as React from 'react';
import {Button} from '@/components/uiStyled/button';
import {uploadFile} from '@/lib/api/upload';
import {patchAction} from '@/lib/api/actions';
import type {ActionDto} from '@/lib/api/actions';
import {cn} from '@/lib/utils/cn';
import Image from 'next/image';
import {apiUrl} from '@/lib/api/url';


interface AdminActionEditFormProps {
  action: ActionDto;
  onUpdated?: () => void;
}

export default function AdminActionEditForm({
  action,
  onUpdated,
}: AdminActionEditFormProps) {
  const [title, setTitle] = React.useState(action.title);
  const [description, setDescription] = React.useState(action.description);
  const [published, setPublished] = React.useState(action.published);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    action.imageUrl ?? null
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const setFileWithPreview = (file: File | null) => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let imageUrl = action.imageUrl;

      if (file) {
        const uploaded = await uploadFile(file);
        imageUrl = uploaded.url.startsWith('http')
          ? uploaded.url
          : apiUrl(uploaded.url);
      }

      await patchAction(action.id, {
        title,
        description,
        published,
        imageUrl: imageUrl ?? undefined,
      });

      setSuccess('Action mise à jour avec succès !');
      if (onUpdated) onUpdated();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold text-gray-800">Modifier l’action</h2>

      {/* title */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={cn(
            'mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
          )}
          required
        />
      </div>

      {/* description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={cn(
            'mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
          )}
          required
        />
      </div>

      {/* image */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text">Image</label>
        <label className="mt-1 cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition w-fit">
          {file ? 'Changer l’image' : 'Choisir une image'}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFileWithPreview(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>
        {previewUrl && (
          <div className="mt-2 flex">
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              unoptimized
              className="max-h-32 w-auto rounded-md object-contain shadow-sm border"
            />
          </div>
        )}
      </div>

      {/* published ? */}
      <div className="flex items-center gap-2 mt-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm font-medium text-text">
          Publier
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <Button type="submit" variant="default" disabled={loading}>
        {loading ? 'Mise à jour...' : 'Mettre à jour'}
      </Button>
    </form>
  );
}
