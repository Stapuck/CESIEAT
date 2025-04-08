import { useAuth } from "react-oidc-context";

function LoginPage() {
    const auth = useAuth();

    const handleLogin = () => {
        auth.signinRedirect();
      
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Veuillez vous connecter</h1>
            <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Se connecter
            </button>
        </div>
    );
}

export default LoginPage;