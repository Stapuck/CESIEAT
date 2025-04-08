import { Navigate, Outlet } from "react-router";
import { useAuth } from "react-oidc-context";
import { useLogger } from "../hooks/useLogger";

function Protected() {
    const auth = useAuth();
    const logger = useLogger();


    switch (auth.activeNavigator) {
        case "signinSilent":
            logger({
                type: "info",
                message: `Silent sign-in attempt by user: ${auth.user?.profile?.name || "unknown"}`,
                clientId_Zitadel: auth.user?.profile?.sub || "unknown",
            });
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            logger({
                type: "info",
                message: `Sign-out attempt by user: ${auth.user?.profile?.name || "unknown"}`,
                clientId_Zitadel: auth.user?.profile?.sub || "unknown",
            });
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        logger({
            type: "error",
            message: `Authentication Error: ${auth.error.message}`,
            clientId_Zitadel: auth.user?.profile?.sub || "unknown",
        });
        return <div>Oops, an error occurred: {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        logger({
            type: "info",
            message: `User authenticated: ${auth.user?.profile?.name || "unknown"}`,
            clientId_Zitadel: auth.user?.profile?.sub || "unknown",
        });
        return <Outlet />;
    }
    logger({
        type: "info",
        message: "User is not authenticated, redirecting to login",
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
    });
    return <Navigate to="/commercial/login" />;
}

export default Protected;
