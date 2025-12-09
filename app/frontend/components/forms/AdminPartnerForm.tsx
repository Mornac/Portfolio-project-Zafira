'use client';

import * as React from 'react';
import Image from 'next/image';
import {Button} from '../uiStyled/button';
import {cn} from '@/lib/utils/cn';
import {uploadFile} from '@/lib/api/upload';
import {createPartner, CreatePartnerDto} from '@/lib/api/partners';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

interface AdminPartnerFormProps {
  onCreated?: () => void;
}

export default function AdminPartnerForm({onCreated}: AdminPartnerFormProps) {
  // --- Form state ---
  const [companyName, setCompanyName] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  // --- API base URL from environment variables ---
  const API_IMG_URL = 'http://localhost:3001';

  // --- Clean up preview URL when component unmounts ---
  React.useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  // --- Handle logo file selection ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;

    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);

    setFile(chosen);
    if (chosen) setLogoPreviewUrl(URL.createObjectURL(chosen));
  };

  // --- Handle form submission ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = '';

      // Upload logo if a file was selected
      if (file) {
        const uploaded = await uploadFile(file);
        logoUrl = uploaded.url.startsWith('http')
          ? uploaded.url
          : `${API_IMG_URL}${uploaded.url}`;
      }

      // Build partner DTO
      const partnerData: CreatePartnerDto = {
        companyName,
        name,
        email,
        phoneNumber,
        logoUrl,
      };

      await createPartner(partnerData);

      // Success feedback
      toast.success('Partner created successfully ✅');

      // Reset form
      setCompanyName('');
      setName('');
      setEmail('');
      setPhoneNumber('');
      setFile(null);

      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(null);
      }

      if (onCreated) onCreated();
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Company name */}
      <input
        type="text"
        placeholder="Nom de la societé"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className={cn('px-3 py-2 rounded-md border')}
        required
      />

      {/* Contact name (optional) */}
      <input
        type="text"
        placeholder="Nom  du contact (optionnel)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cn('px-3 py-2 rounded-md border')}
      />

      {/* Email (optional) */}
      <input
        type="email"
        placeholder="Email (optionel)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn('px-3 py-2 rounded-md border')}
      />

      {/* Phone (optional) */}
      <input
        type="tel"
        placeholder="Téléphone (optionel)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className={cn('px-3 py-2 rounded-md border')}
      />

      {/* Logo upload */}
      <label className="cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md w-fit hover:bg-primary-dark transition">
        {file ? 'Changer logo' : 'Charger un logo'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Logo preview (using Next Image for optimization) */}
      {logoPreviewUrl && (
        <div className="relative w-32 h-32 mt-2">
          <Image
            src={logoPreviewUrl}
            alt="Logo preview"
            fill
            className="object-contain rounded-md border shadow-sm"
          />
        </div>
      )}

      {/* Submit button */}
      <Button type="submit" variant="default" size="sm" disabled={loading}>
        {loading ? 'Creating...' : 'Creer partenaire'}
      </Button>
    </form>
  );
}
