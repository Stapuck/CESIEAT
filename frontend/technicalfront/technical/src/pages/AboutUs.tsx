const AboutPage = () => {
  return (
    <div className="text-gray-800 min-h-screen p-8 mt-35">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">À propos de cesiEat</h1>
        <p className="text-lg mb-4">
          Bienvenue sur cesiEat, votre nouvelle solution de livraison de repas, conçue pour vous offrir une expérience de commande et de livraison rapide, fiable et simple. Nous mettons en relation les meilleurs restaurants de votre région avec des livreurs locaux afin de vous apporter vos repas préférés directement à votre porte.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
        <p className="text-lg mb-6">
          Chez cesiEat, nous croyons que la nourriture doit être accessible, pratique et délicieuse. Nous avons pour objectif de simplifier la façon dont vous commandez vos repas et d'offrir aux restaurants une plateforme moderne pour étendre leur service de livraison. En utilisant notre plateforme, vous bénéficiez d'une expérience sans stress, qu’il s’agisse de dîner en famille, de commander pour un événement spécial ou simplement de savourer un bon repas après une longue journée.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Pourquoi cesiEat ?</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Large choix de restaurants : Une sélection variée de restaurants, allant des grandes enseignes aux petites perles locales.</li>
          <li>Livraison rapide et fiable : Nous nous engageons à vous livrer dans les meilleurs délais, tout en garantissant la qualité de vos plats.</li>
          <li>Facilité d'utilisation : Commandez en quelques clics, suivez votre commande en temps réel et payez de manière sécurisée.</li>
          <li>Soutien aux restaurants locaux : CesiEat permet aux restaurants indépendants de s’adapter aux besoins des consommateurs modernes tout en développant leur activité.</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
