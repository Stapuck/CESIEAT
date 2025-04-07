import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function Protected() {
  const auth = useAuth();
  const redirectToastShown = useRef(false);

  // Afficher une notification lorsqu'une erreur d'authentification se produit
  useEffect(() => {
    if (auth.error) {
      toast.error(`Erreur d'authentification: ${auth.error.message}`);
    }
  }, [auth.error]);

  // Afficher une notification lors de la redirection
  useEffect(() => {
    if (
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !redirectToastShown.current
    ) {
      toast.info("Vous devez être connecté pour accéder à cette page");
      redirectToastShown.current = true;
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  // États de navigation d'authentification
  switch (auth.activeNavigator) {
    case "signinSilent":
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              Connexion en cours...
            </h2>
            <p className="text-gray-500 mt-2">
              Veuillez patienter pendant que nous vous connectons
            </p>
          </div>
        </div>
      );
    case "signoutRedirect":
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              Déconnexion en cours...
            </h2>
            <p className="text-gray-500 mt-2">
              Vous allez être redirigé dans un instant
            </p>
          </div>
        </div>
      );
  }

  // État de chargement
  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Chargement...</h2>
          <p className="text-gray-500 mt-2">
            Vérification de votre authentification
          </p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (auth.error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg">
          <div className="bg-red-100 p-3 rounded-full inline-flex mx-auto mb-4">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Erreur d'authentification
          </h2>
          <p className="text-gray-500 mt-2">{auth.error.message}</p>
          <button
            onClick={() => (window.location.href = "/client/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Utilisateur authentifié - passer l'état d'authentification via context
  if (auth.isAuthenticated) {
    console.log(
      "Utilisateur authentifié, passage du contexte login=true à Outlet"
    );
    return <Outlet context={{ login: true }} />;
  }

  // Utilisateur non authentifié - redirection
  // Notification gérée par useEffect, ne pas afficher de toast ici
  return <Navigate to="/client/" replace />;
}

export default Protected;
