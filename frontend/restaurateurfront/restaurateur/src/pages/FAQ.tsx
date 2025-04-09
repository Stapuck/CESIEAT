import { useState } from "react";

const FAQRestaurateurs = () => {
  const [openIndex, setOpenIndex] = useState<Number | null>();

  const questions = [
    {
      q: "Comment devenir partenaire cesiEat ?",
      a: "Vous pouvez remplir un formulaire d'inscription depuis notre page 'Rejoindre en tant que restaurant'. Un membre de notre équipe vous contactera rapidement.",
    },
    {
      q: "Quels sont les frais pour les restaurateurs ?",
      a: "cesiEat prend une commission de 2% sur chaque commande passée via notre plateforme pour les frais de service et de maintenance",
    },
    {
      q: "Comment recevoir les paiements ?",
      a: "Les paiements sont transférés chaque semaine sur votre compte bancaire, après déduction de notre commission.",
    },
    {
      q: "Puis-je modifier mon menu en ligne ?",
      a: "Oui, vous avez accès à un tableau de bord pour modifier les prix, les plats, les horaires, et les disponibilités.",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen rounded-2xl mt-35">
      <h1 className="text-3xl font-bold mb-6">FAQ Restaurateurs</h1>
      {questions.map((item, idx) => (
        <div key={idx} className="mb-4 border rounded-lg overflow-hidden bg-white ">
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

export default FAQRestaurateurs;
