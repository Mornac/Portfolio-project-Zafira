'use client';

import * as React from 'react';
import Image from 'next/image';
import {Button} from '../uiStyled/button';
import {uploadFile} from '@/lib/api/upload';
import {updatePartner, PartnerDto, CreatePartnerDto} from '@/lib/api/partners';
import toast from 'react-hot-toast';

interface AdminPartnerEditFormProps {
  partner: PartnerDto;
  onUpdated?: () => void;
}


const API_IMG_URL = 'http://localhost:3001';

export default function AdminPartnerEditForm({
  partner,
  onUpdated,
}: AdminPartnerEditFormProps) {
  const [companyName, setCompanyName] = React.useState(partner.companyName);
  const [name, setName] = React.useState(partner.name || '');
  const [email, setEmail] = React.useState(partner.email || '');
  const [phoneNumber, setPhoneNumber] = React.useState(
    partner.phoneNumber || ''
  );
  const [file, setFile] = React.useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string>(
    partner.logoUrl
  );
  const [loading, setLoading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setFile(chosen);
    if (chosen) setLogoPreviewUrl(URL.createObjectURL(chosen));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = partner.logoUrl;
      if (file) {
        const uploaded = await uploadFile(file);
        logoUrl = uploaded.url.startsWith('http')
          ? uploaded.url
          : `${API_IMG_URL}${uploaded.url}`;
      }

      const updateData: CreatePartnerDto = {
        companyName,
        name,
        email,
        phoneNumber,
        logoUrl,
      };

      await updatePartner(partner.id, updateData);
      toast.success('Partenaire mis à jour !');
      if (onUpdated) onUpdated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Nom de l'entreprise"
        className="px-3 py-2 border rounded-md"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du contact (optionnel)"
        className="px-3 py-2 border rounded-md"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (optionnel)"
        className="px-3 py-2 border rounded-md"
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Téléphone (optionnel)"
        className="px-3 py-2 border rounded-md"
      />

      <label className="cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md w-fit hover:bg-primary-dark transition">
        {file ? 'Changer le logo' : 'Changer le logo'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {logoPreviewUrl && (
        <div className="w-32 h-32 mt-2 relative">
          <Image
            src={logoPreviewUrl}
            alt="Aperçu du logo"
            fill
            style={{objectFit: 'contain'}}
          />
        </div>
      )}

      <Button type="submit" variant="default" size="sm" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Mettre à jour'}
      </Button>
    </form>
  );
}
