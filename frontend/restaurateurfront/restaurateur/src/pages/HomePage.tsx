import { useAuth } from "react-oidc-context";

const RestaurateurPage = () => {
  const auth = useAuth();
  console.log("=====================")
  console.log(import.meta.env.MODE)
  console.log(import.meta.env.MODE)
  console.log(import.meta.env.MODE)
  console.log(import.meta.env.MODE)
  console.log(import.meta.env.MODE)
  console.log("=====================")
  console.log(import.meta.env.NODE_ENV)
  console.log(import.meta.env.VITE_REDIRECT_URI_RESTAURATEUR)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Rejoignez CESI Eat en tant que Restaurateur
      </h1>
      <p className="text-lg text-gray-700 max-w-xl text-center">
        Augmentez votre visibilité et boostez vos ventes en rejoignant la plateforme CESI Eat. Proposez vos plats à une large clientèle et profitez d'un service de livraison optimisé.
      </p>
      {auth.isAuthenticated ? <>
        <p className="text-lg text-gray-800 max-w-xl text-center mt-2">
          Une belle aventure commence avec Cesi EAT
        </p>
      </> : 
      
      <> <button
      onClick={() => void auth.signinRedirect()}
      className="text-lg text-gray-800 max-w-xl text-center mt-2"
      >
        Connectez-vous pour accéder à l'ensemble de vos services.
      </button>

      </>}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <img
            src="https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Restaurant"
            className="w-full h-40 object-cover rounded-xl"
          />
          <p className="text-center text-gray-800 mt-2 font-semibold">
            Faites découvrir votre cuisine à de nouveaux clients.
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1653233797467-1a528819fd4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Chef cuisinier"
            className="w-full h-40 object-cover rounded-xl"
          />
          <p className="text-center text-gray-800 mt-2 font-semibold">
            Concentrez-vous sur la cuisine, nous nous occupons de la livraison.
          </p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pourquoi devenir partenaire CESI Eat ?</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Augmentez vos revenus en touchant plus de clients.</li>
          <li>Un système de gestion des commandes simple et efficace.</li>
          <li>Une logistique de livraison rapide et fiable.</li>
          <li>Une assistance dédiée pour vous accompagner au quotidien.</li>
        </ul>
      </div>
      <footer className="mt-10 bg-gray-800 text-white p-6 w-full text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-semibold">CESI Eat &copy; 2024 - Tous droits réservés</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="hover:underline">À propos</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Politique de confidentialité</a>
            <a href="#" className="hover:underline">Conditions d'utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurateurPage;
