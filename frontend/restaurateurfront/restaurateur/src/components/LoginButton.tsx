import { useAuth } from "react-oidc-context";
import ZitadelLogo from "../assets/zitadel.png";

function LoginButton() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <button
        className="flex w-50 items-center justify-center gap-2 px-4 py-2 bg-tertiary text-white rounded hover:bg-blue-600"
        onClick={() => void auth.removeUser()}
      >
        Se déconnecter
      </button>
    );
  }

  return (
    <button
      onClick={() => void auth.signinRedirect()}
      className="flex w-50 justify-center items-center gap-2 px-4 py-2 bg-tertiary text-white rounded hover:bg-blue-600"
    >
      <img src={ZitadelLogo} alt="Zitadel Logo" className="h-5" />
      Se connecter
    </button>
  );
}

export default LoginButton;
