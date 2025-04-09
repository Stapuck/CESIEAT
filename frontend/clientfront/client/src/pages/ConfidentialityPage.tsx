const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">Politique de Confidentialité</h1>

        <p className="text-lg mb-4">
          Chez cesiEat, nous nous engageons à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web et nos services.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Informations collectées</h2>
        <p className="text-lg mb-4">
          Nous collectons différentes catégories d'informations lorsque vous utilisez notre service, telles que :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Informations personnelles : Lorsque vous créez un compte, passez une commande ou vous abonnez à notre newsletter, nous recueillons des informations telles que votre nom, adresse e-mail, numéro de téléphone, et adresse de livraison.</li>
          <li>Données de paiement : Nous recueillons des informations relatives à votre paiement, telles que vos coordonnées bancaires ou informations de carte de crédit, afin de traiter les paiements.</li>
          <li>Données de géolocalisation : Lorsque vous utilisez notre application mobile ou le site web, nous pouvons recueillir des informations sur votre emplacement pour vous permettre de localiser les restaurants et suivre votre commande.</li>
          <li>Données de navigation : Nous recueillons des informations sur votre utilisation de notre site, telles que votre adresse IP, le type de navigateur, et la durée de votre visite.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
        <p className="text-lg mb-6">
          Nous utilisons vos données personnelles pour les raisons suivantes :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Traitement des commandes : Pour traiter et livrer vos commandes, gérer votre compte et vous envoyer des informations sur votre commande.</li>
          <li>Amélioration des services : Pour analyser et améliorer la qualité de nos services et de notre plateforme, ainsi que pour résoudre des problèmes techniques.</li>
          <li>Communication : Pour vous envoyer des notifications importantes, y compris des mises à jour sur vos commandes et des promotions.</li>
          <li>Sécurité : Pour assurer la sécurité de notre site et prévenir toute activité frauduleuse.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">3. Partage des données</h2>
        <p className="text-lg mb-6">
          Nous ne vendons ni ne partageons vos données personnelles à des tiers sans votre consentement, sauf dans les cas suivants :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Partenaires de livraison : Nous partageons vos informations de livraison avec nos partenaires de livraison afin qu'ils puissent effectuer la livraison de vos repas.</li>
          <li>Prestataires de services : Nous pouvons faire appel à des prestataires de services tiers (par exemple, des processeurs de paiement) pour faciliter nos opérations, mais ces tiers sont tenus de respecter la confidentialité de vos données.</li>
          <li>Conformité légale : Si la loi l'exige ou dans le cadre d'une procédure légale, nous pouvons être amenés à divulguer vos informations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">4. Sécurité des données</h2>
        <p className="text-lg mb-4">
          Nous prenons des mesures de sécurité strictes pour protéger vos informations personnelles contre l'accès non autorisé, la divulgation ou l'altération. Nous utilisons des technologies de cryptage pour protéger vos informations de paiement et nous veillons à ce que nos employés suivent des procédures de sécurité rigoureuses.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Vos droits</h2>
        <p className="text-lg mb-4">
          Conformément à la législation applicable, vous avez le droit de :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg mb-2">
          <li>Accéder à vos données personnelles et demander leur modification ou leur suppression.</li>
          <li>Retirer votre consentement à tout moment pour l’utilisation de vos données personnelles.</li>
          <li>Vous opposer au traitement de vos données pour des raisons légales.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">6. Modifications de la politique de confidentialité</h2>
        <p className="text-lg mb-4">
          Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant une version révisée de cette politique sur notre site. Il est important que vous consultiez régulièrement cette page pour être informé des mises à jour.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Contactez-nous</h2>
        <p className="text-lg mb-4">
          Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité ou l'utilisation de vos données personnelles, n'hésitez pas à nous contacter à l'adresse suivante : <strong>contact@cesiEat.com</strong>.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
