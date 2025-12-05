// app/partners/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Partenaires | Zafira",
  description: "Découvrez nos partenaires et collaborations.",
};

export default function PartnersPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Nos partenaires</h1>
      <p>
        Bienvenue sur la page de nos partenaires. Cette section présente les
        collaborations et alliances de Zafira.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Partenaires principaux</h2>
        <ul>
          <li>
            <Image
              src="/images/partner1.png"
              alt="Logo partenaire 1"
              width={120}
              height={60}
            />
          </li>
          <li>
            <Image
              src="/images/partner2.png"
              alt="Logo partenaire 2"
              width={120}
              height={60}
            />
          </li>
          <li>
            <Image
              src="/images/partner3.png"
              alt="Logo partenaire 3"
              width={120}
              height={60}
            />
          </li>
        </ul>
      </section>
    </main>
  );
}
