const TarifsPage = () => {
    return (
      <div className="min-h-screen flex flex-col mt-35">
        <div className="p-8 max-w-4xl mx-auto h-max bg-white rounded-2xl">
          <h1 className="text-3xl font-bold mb-6">Tarifs & Répartition</h1>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>cesiEat prélève une commission de 2% sur chaque commande.</li>
            <li>Les livreurs reçoivent entre 3€ et 8€ par livraison selon la distance.</li>
            <li>Les restaurants conservent environ 85% à 90% du montant de chaque commande.</li>
          </ul>
        </div>
      </div>
    );
  };
  export default TarifsPage;