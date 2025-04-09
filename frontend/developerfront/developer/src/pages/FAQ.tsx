import { useState } from "react";

const FAQDeveloppeurs = () => {
  const [openIndex, setOpenIndex] = useState<Number | null>();

  const questions = [
    {
      q: "Quelle stack est utilisée chez cesiEat ?",
      a: "Nous utilisons React.js pour le front, Node.js pour l'API, MongoDB comme base de données, et Tailwind CSS pour le style.",
    },
    {
      q: "Y a-t-il un environnement de staging ?",
      a: "Oui, chaque nouvelle fonctionnalité passe par une validation sur l'environnement de staging avant la production.",
    },
    {
      q: "Comment déployer une nouvelle version ?",
      a: "Les déploiements sont faits via GitHub Actions avec un processus CI/CD automatisé. Seuls les développeurs autorisés peuvent lancer un déploiement.",
    },
    {
      q: "Peut-on contribuer à l'open source ?",
      a: "Nous avons quelques projets internes que nous prévoyons de rendre open source. Restez à l'écoute sur notre GitHub !",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">FAQ Développeurs</h1>
      {questions.map((item, idx) => (
        <div key={idx} className="mb-4 border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full text-left p-4 bg-gray-100 font-semibold"
          >
            {item.q}
          </button>
          {openIndex === idx && (
            <div className="p-4 bg-white text-gray-800">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQDeveloppeurs;
