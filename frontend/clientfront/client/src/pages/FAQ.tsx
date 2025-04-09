import {useState} from 'react'

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<Number| null>();
    const questions = [
      { q: "Comment passer une commande ?", a: "Vous pouvez passer une commande via notre application ou site web en quelques clics." },
      { q: "Quels sont les délais de livraison ?", a: "Les livraisons sont généralement effectuées en moins de 30 minutes.Tout dépend de la disponibilité des livreurs et de la demande au niveau des restaurants." },
      { q: "Comment suivre ma commande ?", a: "Vous pouvez suivre votre commande en temps réel depuis votre profil." },
    ];
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Questions fréquentes</h1>
          {questions.map((item, idx) => (
            <div key={idx} className="mb-4 border rounded-lg">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-4 bg-gray-100 font-semibold"
              >
                {item.q}
              </button>
              {openIndex === idx && <div className="p-4 bg-white">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };
export default FAQPage;
