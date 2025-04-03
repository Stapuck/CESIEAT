import { FaUser } from "react-icons/fa";
import { useAuth } from "react-oidc-context";

function LoginButton() {
  const auth = useAuth();
  return (
    <div className="mt-auto pt-4 border-t border-gray-700">
      {!auth.isAuthenticated && (
        <button
          onClick={() => void auth.signinRedirect()}
          className="flex items-center space-x-2 py-3 px-4 w-full hover:bg-gray-700 rounded text-white font-semibold"
        >
          <FaUser /> <span>Se connecter</span>
        </button>
      )}
      {auth.isAuthenticated && (
        <button
          onClick={() => void auth.removeUser()}
          className="flex items-center space-x-2 py-3 px-4 w-full hover:bg-gray-700 rounded text-white font-semibold"
        >
          <FaUser /> <span>Se déconnecter</span>
        </button>
      )}
    </div>
  );

  if (auth.isAuthenticated) {
    return <button onClick={() => void auth.removeUser()}>Log out</button>;
  }

  return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default LoginButton;
