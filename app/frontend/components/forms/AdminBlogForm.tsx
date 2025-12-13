'use client';

import * as React from 'react';
import {Button} from '../uiStyled/button';
import {cn} from '@/lib/utils/cn';
import {uploadFile} from '@/lib/api/upload';
import {createBlog, CreateBlogDto} from '@/lib/api/blog';
import {useRouter} from 'next/navigation';
import {apiUrl} from '@/lib/api/url';

interface AdminBlogFormProps {
  onCreated?: () => void;
}

export default function AdminBlogForm({onCreated}: AdminBlogFormProps) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [published, setPublished] = React.useState(true);

  // preview URLs (memorisé pour éviter de recréer l'URL à chaque render)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = React.useState<string | null>(
    null
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();

  // --- create / revoke object URLs in a controlled way ---
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // cleanup on unmount

  // helper to set file + preview, revoking previous url if exists
  const setFileWithPreview = (file: File | null) => {
    // revoke previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const setCoverWithPreview = (file: File | null) => {
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl(null);
    }
    setCoverFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreviewUrl(url);
    }
  };

  // small util
  const isVideo = (f: File | null) => !!f && f.type.startsWith('video');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let mediaUrl: string | undefined;
      let mediaType: 'IMAGE' | 'VIDEO' | undefined;
      let coverImageUrl: string | undefined;

      if (file) {
        const uploaded = await uploadFile(file);
        mediaUrl = uploaded.url.startsWith('http')
          ? uploaded.url
          : apiUrl(uploaded.url);
        mediaType = uploaded.mimeType.startsWith('video') ? 'VIDEO' : 'IMAGE';
      }

      if (coverFile) {
        const uploadedCover = await uploadFile(coverFile);
        coverImageUrl = uploadedCover.url.startsWith('http')
          ? uploadedCover.url
          : apiUrl(uploadedCover.url);
      } else if (mediaType === 'IMAGE') {
        coverImageUrl = mediaUrl;
      }

      const blogData: CreateBlogDto = {
        title,
        content,
        mediaUrl,
        mediaType,
        coverImageUrl,
        published,
      };

      await createBlog(blogData);

      setSuccess('Blog créé avec succès !');
      setTitle('');
      setContent('');
      // revoke previews and clear
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
        setCoverPreviewUrl(null);
      }
      setFile(null);
      setCoverFile(null);
      if (onCreated) onCreated();
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // stylized file input handler
  const handleChooseFile =
    (setter: (f: File | null) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const chosen = e.target.files?.[0] ?? null;
      setter(chosen);
    };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Title (50% width) */}
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

      {/* Content */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={cn(
            'mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
          )}
          rows={6}
          required
        />
      </div>

      {/* Media principal */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text">Média principal</label>

        {/* stylized button (label) */}
        <label className="mt-1 cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition w-fit">
          {file ? 'Changer le fichier' : 'Choisir un fichier'}
          <input
            type="file"
            accept="image/*,video/*,.mov,.avi,.mkv"
            onChange={(e) => {
              const chosen = e.target.files?.[0] ?? null;
              setFileWithPreview(chosen);
            }}
            className="hidden"
          />
        </label>

        {/* preview centered and fixed size (max height) */}
        {previewUrl && (
          <div className="mt-2 flex">
            {isVideo(file) ? (
              // video preview: non interactive, uses memorized previewUrl
              <video
                src={previewUrl}
                className="max-h-32 w-auto rounded-md object-contain shadow-sm border pointer-events-none select-none"
                tabIndex={-1}
                muted
                playsInline
              />
            ) : (
              // image preview: same sizing
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-32 w-auto rounded-md object-contain shadow-sm border"
              />
            )}
          </div>
        )}
      </div>

      {/* Image de couverture optionnelle (only shown when media is video) */}
      {isVideo(file) && (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text">
            Image de couverture (optionnelle pour la vidéo)
          </label>

          <label className="mt-1 cursor-pointer inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md w-fit hover:bg-secondary-dark transition">
            {coverFile ? 'Changer la couverture' : 'Insérer une image'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const chosen = e.target.files?.[0] ?? null;
                setCoverWithPreview(chosen);
              }}
              className="hidden"
            />
          </label>

          {coverPreviewUrl ? (
            <div className="mt-2 w-full flex">
              <img
                src={coverPreviewUrl}
                alt="Cover Preview"
                className="max-h-32 w-auto rounded-md object-contain shadow-sm border"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-1">
              Vous pouvez ajouter une image de couverture pour votre vidéo.
            </p>
          )}
        </div>
      )}
      {/* Publier le blog ? */}
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
        {loading ? 'Création...' : 'Créer le blog'}
      </Button>
    </form>
  );
}
