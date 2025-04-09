const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Conditions d'utilisation</h1>
        <p className="mb-4">
          En utilisant cesiEat, vous acceptez nos conditions générales :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>
            Respect des horaires et disponibilité des restaurants partenaires.
          </li>
          <li>
            Utilisation honnête du système de parrainage et des promotions.
          </li>
          <li>Respect et courtoisie envers les livreurs et restaurateurs.</li>
          <li>
            Responsabilité de l'utilisateur pour les informations fournies
            (adresse, numéro, etc.).
          </li>
        </ul>
      </div>
    </div>
  );
};
export default TermsPage;
