const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col mt-35">
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl">
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
          <li>Respect et courtoisie envers les clients et restaurateurs.</li>
          <li>
            Responsabilité de l'utilisateur pour le code de la route. 
          </li>
          <li>
            Responsabilité civil d'aide à autrui en cas de besoin. 
          </li>
        </ul>
      </div>
    </div>
  );
};
export default TermsPage;
