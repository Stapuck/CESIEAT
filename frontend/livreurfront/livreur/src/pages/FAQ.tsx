import { useState } from "react";

const FAQLivreurs = () => {
  const [openIndex, setOpenIndex] = useState<Number | null >();

  const questions = [
    {
      q: "Comment devenir livreur chez cesiEat ?",
      a: "Vous devez remplir notre formulaire d'inscription, fournir vos papiers d'identité et un justificatif de statut auto-entrepreneur.",
    },
    {
      q: "Combien puis-je gagner par livraison ?",
      a: "Le tarif varie selon la distance, entre 3€ et 10€ par livraison en moyenne.",
    },
    {
      q: "Comment suis-je payé ?",
      a: "Vous êtes payé chaque semaine directement sur votre compte bancaire.",
    },
    {
      q: "Puis-je choisir mes horaires ?",
      a: "Oui, vous êtes libre de vous connecter et de travailler selon vos disponibilités.",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">FAQ Livreurs</h1>
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

export default FAQLivreurs;
