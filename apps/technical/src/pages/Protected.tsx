import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function Protected() {
    const auth = useAuth();

    console.log("Auth State:", {
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        error: auth.error,
        activeNavigator: auth.activeNavigator,
    });

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
        console.error("Authentication Error:", auth.error);
        return <div>Oops, an error occurred: {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        console.log("🟩 User is authenticated");
        return <Outlet />;
    }

    console.warn("🤡 User is not authenticated, redirecting to login...");
    return <Navigate to="/technical/login" />;
}

export default Protected;
