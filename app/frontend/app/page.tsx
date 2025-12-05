'use client';

import HeroSection from '@/components/sections/HeroSection';
import ActionSection from '@/components/sections/ActionsSection';
import BlogSection from '@/components/sections/BlogSection';
import FAQSection from '@/components/sections/FAQSection';
import ImpactSection from '@/components/sections/ImpactSection';
import MissionSection from '@/components/sections/MissionSection';
import ParticipationSection from '@/components/sections/ParticipationSection';
import PartnersSection from '@/components/sections/PartnersSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import MerciSection from '@/components/sections/MerciSection';

export default function HomePage() {
  return (
    <main>
      <section id="home" className="min-h-screen">
        <HeroSection />
      </section>

      <section id="impact">
        <ImpactSection />
      </section>

      <section id="mission">
        <MissionSection />
      </section>

      <section id="actions">
        <ActionSection />
      </section>

      <section id="blog">
        <BlogSection />
      </section>

      <section id="faq">
        <FAQSection />
      </section>

      <section id="partners">
        <PartnersSection />
      </section>

      <section id="participation">
        <ParticipationSection />
      </section>

      <section id="testimonials">
        <TestimonialSection />
      </section>

      <section id="remerciements">
        <MerciSection />
      </section>
    </main>
  );
}
