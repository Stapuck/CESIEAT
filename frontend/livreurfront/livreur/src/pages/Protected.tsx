import { Navigate, Outlet } from "react-router";
import { useAuth } from "react-oidc-context";

function Protected() {
    const auth = useAuth();

    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops an error occured caused {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        console.log(" 🟩 AUTH");
        return <Outlet></Outlet>;
    }

    console.log("🤡 NOT AUTH");
    auth.signinRedirect();

    // Retourner null ou un composant de chargement au lieu de Navigate
    return <div>Redirection vers la page de connexion...</div>;
}

export default Protected;
