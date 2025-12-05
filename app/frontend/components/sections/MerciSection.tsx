'use client';

import React from 'react';

const team = [
  {
    name: 'Jeffrey Basset',
    role: 'Co-créateur & Développeur FullStack',
    linkedin: 'https://www.linkedin.com/in/jeffrey-basset/',
  },
  {
    name: 'Ingrid Mornac',
    role: 'Co-créatrice & Développeuse FullStack',
    linkedin: 'https://www.linkedin.com/in/ingrid-mornac-a01816a1/',
  },
  {
    name: 'Hugo Chilemme',
    role: 'Software Engineer & Hébergeur',
    linkedin: 'https://www.linkedin.com/in/hugo-linkedin/',
  },
];

export default function MerciSection() {
  return (
    <section id="remerciements" className="py-20 bg-background text-text scroll-mt-20">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <h2 className="text-3xl font-bold text-center mb-10">
          Remerciements
        </h2>

        <div className="space-y-6 text-lg leading-relaxed text-justify mb-12">
          <p>
            Parce que rien d’important ne se réalise seul, Zafira Solidaire souhaite remercier celles et ceux qui ont rendu ce site possible.
          </p>

          <p>
            Un merci tout particulier à <strong>Jeffrey Basset et Ingrid Mornac</strong> pour avoir imaginé, conçu et mis en ligne cette plateforme.
            Vous avez su traduire les valeurs de l’association, mettre en lumière ses actions, et représenter au mieux son identité et son histoire.
          </p>

          
          <p>
            Merci à <strong>Hugo Chilemme, Tuteur du projet</strong>, dont l’engagement, l’accompagnement technique et la mise à disposition des serveurs ont été essentiels à l’aboutissement du site.
          </p>

          <p>
            Merci à <strong>Ancelin Chevallier et Théo Dessaigne</strong> pour leurs idées et leur participation lors de la conception du projet.
          </p>

          <p>
            Nous exprimons également notre gratitude envers <strong>Holberton School Toulouse</strong>, qui nous a réunis autour de cet appel à projet solidaire.
          </p>
        </div>

        {/* Cartes de l’équipe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                {/* Icône LinkedIn SVG */}
                 <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 24h5V7H0v17zM7 7h4.79v2.34h.07c.67-1.27 2.3-2.61 4.73-2.61C22.17 6.73 24 9.03 24 13.1V24h-5v-9.1c0-2.17-.04-4.96-3.02-4.96-3.03 0-3.49 2.37-3.49 4.81V24H7V7z" />
                  </svg>
                </span>
                {member.role}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}