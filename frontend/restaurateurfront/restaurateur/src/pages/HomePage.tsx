import { useAuth } from "react-oidc-context";
import Footer from "../components/Footer";

const RestaurateurPage = () => {
  const auth = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center w-full mt-10 pt-10 justify-center ">
      <div className="bg-transparent-background flex flex-col items-center my-9 px-6 py-3  rounded-md">
        <h1 className="text-4xl font-bold  text-gray-900 mb-6">
          Rejoignez CESI Eat en tant que Restaurateur
        </h1>
        <p className="text-lg text-gray-700 max-w-xl italic text-center">
          Augmentez votre visibilité et boostez vos ventes en rejoignant la
          plateforme CESI Eat. Proposez vos plats à une large clientèle et
          profitez d'un service de livraison optimisé.
        </p>
        {auth.isAuthenticated ? (
          <>
            <p className="text-lg text-gray-800 max-w-xl text-center mt-2">
              Une belle aventure commence avec Cesi EAT
            </p>
          </>
        ) : (
          <>
            {" "}
            <button
              onClick={() => void auth.signinRedirect()}
              className="text-lg text-gray-800 max-w-xl text-center mt-2"
            >
              Connectez-vous pour accéder à l'ensemble de vos services.
            </button>
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-default-background p-4 mx-2 rounded-2xl shadow-lg">
          <img
            src="https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Restaurant"
            className="w-full h-40 object-cover rounded-xl"
          />
          <p className="text-center text-gray-800 mt-2 font-semibold">
            Faites découvrir votre cuisine à de nouveaux clients.
          </p>
        </div>
        <div className="bg-default-background mx-2 p-4 rounded-2xl shadow-lg">
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
      <div className="mt-8 bg-default-background p-6 rounded-2xl shadow-lg max-w-2xl mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Pourquoi devenir partenaire CESI Eat ?
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Augmentez vos revenus en touchant plus de clients.</li>
          <li>Un système de gestion des commandes simple et efficace.</li>
          <li>Une logistique de livraison rapide et fiable.</li>
          <li>Une assistance dédiée pour vous accompagner au quotidien.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurateurPage;
