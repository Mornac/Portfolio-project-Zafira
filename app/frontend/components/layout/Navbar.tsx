'use client';

import {HeartHandshake} from 'lucide-react';
import {useAuth} from '@/lib/hooks/useAuth';
import MobileMenu from './MobileMenu';
import LoginDialog from '../uiStyled/LoginDialog';
import UserMenuDialog from '../uiStyled/UserMenuDialog';
import {usePathname, useRouter} from 'next/navigation';

export default function Navbar() {
  const {user} = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const renderUserSection = () => {
    if (!user) return <LoginDialog />;
    return (
      <div className="flex items-center gap-3">
        <UserMenuDialog />
      </div>
    );
  };

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({behavior: 'smooth'});
      }
    } else {
      // Redirige vers la page d'accueil avec l’ancre
      router.push(`/${sectionId}`);
    }
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-bg shadow-md">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <HeartHandshake className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <h1 className="font-heading text-xl text-text">Zafira</h1>
          <p className="text-primary text-xs font-medium">Solidaire</p>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={() => handleNavigation('#hero')}
          className="text-text hover:text-primary transition-colors"
        >
          Accueil
        </button>
        <button
          onClick={() => handleNavigation('#mission')}
          className="text-text hover:text-primary transition-colors"
        >
          À propos
        </button>
        <button
          onClick={() => handleNavigation('#actions')}
          className="text-text hover:text-primary transition-colors"
        >
          Actions
        </button>
        <button
          onClick={() => handleNavigation('#blog')}
          className="text-text hover:text-primary transition-colors"
        >
          Actualités
        </button>
        <button
          onClick={() => handleNavigation('#faq')}
          className="text-text hover:text-primary transition-colors"
        >
          FAQ
        </button>
        <button
          onClick={() => handleNavigation('#participation')}
          className="text-text hover:text-primary transition-colors"
        >
          Dons
        </button>
                <button
          onClick={() => handleNavigation('#remerciements')}
          className="text-text hover:text-primary transition-colors"
        >
          Remerciements
        </button>
        {renderUserSection()}
      </div>

      {/* Mobile menu trigger */}
      <div className="md:hidden flex items-center gap-2">
        {renderUserSection()}
        <MobileMenu handleNavigation={handleNavigation} />
      </div>
    </nav>
  );
}
