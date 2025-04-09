import { useState } from "react";

const FAQTechniciens = () => {
  const [openIndex, setOpenIndex] = useState<Number | null>();

  const questions = [
    {
      q: "Quelles sont les responsabilités des techniciens cesiEat ?",
      a: "Les techniciens sont responsables de la maintenance des équipements (bornes, imprimantes, tablettes) chez les restaurants partenaires.",
    },
    {
      q: "Comment signaler un problème technique ?",
      a: "Les techniciens peuvent utiliser notre application interne pour signaler et gérer les incidents.",
    },
    {
      q: "Quel est le matériel pris en charge ?",
      a: "Tous les équipements fournis par cesiEat, y compris les imprimantes de tickets, tablettes, routeurs, etc.",
    },
    {
      q: "Y a-t-il des astreintes ?",
      a: "Oui, certains techniciens peuvent être d’astreinte selon leur secteur géographique et les accords en place.",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">FAQ Techniciens</h1>
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

export default FAQTechniciens;
