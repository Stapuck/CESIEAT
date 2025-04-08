import { Navigate, Outlet } from "react-router";
import { useAuth } from "react-oidc-context";
import { useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { useLogger } from "../hooks/useLogger";
import { LoadingSpinner } from "../components/auth/LoadingSpinner";

function Protected() {
  const auth = useAuth();
  const redirectToastShown = useRef(false);
  const logger = useLogger();

  // Obtenir l'identifiant de l'utilisateur de manière sécurisée
  const userId = useMemo(() => {
    return auth.user?.profile?.sub || "unknown";
  }, [auth.user?.profile?.sub]);

  // Gérer les erreurs d'authentification
  useEffect(() => {
    if (auth.error) {
      toast.error(`Erreur d'authentification: ${auth.error.message}`);
      logger({
        type: "error",
        message: `Erreur d'authentification: ${auth.error.message}`,
        clientId_Zitadel: userId,
      });
    }
  }, [auth.error, userId, logger]);

  // Gérer les redirections
  useEffect(() => {
    if (
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !redirectToastShown.current
    ) {
      toast.info("Vous devez être connecté pour accéder à cette page");
      logger({
        type: "info",
        message: "Tentative d'accès à une page protégée sans authentification",
        clientId_Zitadel: userId,
      });
      redirectToastShown.current = true;
    }
  }, [auth.isLoading, auth.isAuthenticated, userId, logger]);

  // États de navigation d'authentification
  switch (auth.activeNavigator) {
    case "signinSilent":
      logger({
        type: "info",
        message: `Tentative de connexion silencieuse de l'utilisateur: ${
          auth.user?.profile?.name || "inconnu"
        }`,
        clientId_Zitadel: userId,
      });
      return (
        <LoadingSpinner
          title="Connexion en cours..."
          message="Veuillez patienter pendant que nous vous connectons"
        />
      );
      
    case "signinRedirect":
      logger({
        type: "info", 
        message: "Redirection vers la page de connexion", 
        clientId_Zitadel: userId
      });
      return (
        <LoadingSpinner
          title="Redirection..."
          message="Vous allez être redirigé vers la page de connexion"
        />
      );

    case "signoutRedirect":
      logger({
        type: "info",
        message: `Déconnexion de l'utilisateur: ${
          auth.user?.profile?.name || "inconnu"
        }`,
        clientId_Zitadel: userId,
      });
      return (
        <LoadingSpinner
          title="Déconnexion en cours..."
          message="Vous allez être redirigé dans un instant"
        />
      );
  }

  // État de chargement
  if (auth.isLoading) {
    logger({
      type: "info",
      message: `Chargement de l'authentification pour l'utilisateur: ${
        auth.user?.profile.name || "inconnu"
      }`,
      clientId_Zitadel: userId,
    });
    return (
      <LoadingSpinner
        title="Chargement..."
        message="Vérification de votre authentification"
      />
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
              aria-hidden="true"
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

  // Utilisateur authentifié
  if (auth.isAuthenticated) {
    logger({
      type: "info",
      message: `Utilisateur authentifié: ${auth.user?.profile.name || "inconnu"}`,
      clientId_Zitadel: userId,
    });
    return <Outlet context={{ login: true }} />;
  }

  // Utilisateur non authentifié
  return <Navigate to="/client/" replace />;
}

export default Protected;
