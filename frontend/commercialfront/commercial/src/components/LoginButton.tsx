import { useAuth } from "react-oidc-context";
import ZitadelLogo from "../assets/zitadel.png";
import { useLogger } from "../hooks/useLogger";

function LoginButton() {
  const auth = useAuth();
  const logger = useLogger();

  const handleLogin = () => {
    try {
      logger({
        type: "info",
        message: "Tentative de connexion initiée par l'utilisateur",
        clientId_Zitadel: "anonymous"
      });
      
      auth.signinRedirect();
    } catch (error) {
      logger({
        type: "error",
        message: `Erreur lors de la tentative de connexion: ${error instanceof Error ? error.message : String(error)}`,
        clientId_Zitadel: "anonymous"
      });
    }
  };

  const handleLogout = () => {
    const userId = auth.user?.profile?.sub || "unknown";
    const userName = auth.user?.profile?.name || "inconnu";
    
    logger({
      type: "info",
      message: `Déconnexion de l'utilisateur: ${userName}`,
      clientId_Zitadel: userId
    });
    
    auth.removeUser();
  };

  if (auth.isAuthenticated) {
    return (
      <button
        className="flex w-50 items-center justify-center gap-2 px-4 py-2 bg-tertiary text-white rounded hover:bg-blue-600"
        onClick={handleLogout}
      >
        Se déconnecter
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="flex w-50 justify-center items-center gap-2 px-4 py-2 bg-tertiary text-white rounded hover:bg-blue-600"
    >
      <img src={ZitadelLogo} alt="Zitadel Logo" className="h-5" />
      Se connecter
    </button>
  );
}

export default LoginButton;
