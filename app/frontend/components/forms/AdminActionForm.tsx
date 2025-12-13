'use client';

import * as React from 'react';
import {Button} from '../uiStyled/button';
import {cn} from '@/lib/utils/cn';
import {uploadFile} from '@/lib/api/upload';
import {createAction, CreateActionDto} from '@/lib/api/actions';
import {apiUrl} from '@/lib/api/url';

interface AdminActionFormProps {
  onCreated?: () => void; // callback pour refresh de la liste
}

export default function AdminActionForm({onCreated}: AdminActionFormProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [published, setPublished] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setFileWithPreview = (file: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let imageUrl: string | undefined;

      if (file) {
        const uploaded = await uploadFile(file);
        imageUrl = uploaded.url.startsWith('http')
          ? uploaded.url
          : apiUrl(uploaded.url);
      }

      const actionData: CreateActionDto = {
        title,
        description,
        imageUrl,
        published,
      };

      await createAction(actionData);

      setSuccess('Action créée avec succès !');
      setTitle('');
      setDescription('');
      setPublished(true);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setFile(null);

      // ✅ appel du callback pour refresh la liste
      if (onCreated) onCreated();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="flex flex-col w-1/2">
        <label className="text-sm font-medium text-text">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={cn(
            'mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary w-full'
          )}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn(
            'mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
          )}
          rows={4}
          required
        />
      </div>

      {/* Image upload */}
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
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-32 w-auto rounded-md object-contain shadow-sm border"
            />
          </div>
        )}
      </div>

      {/* Published checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm font-medium text-text">
          Publier directement
        </label>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* Submit */}
      <Button type="submit" variant="default" size="sm" disabled={loading}>
        {loading ? 'Création...' : 'Créer l’action'}
      </Button>
    </form>
  );
}
