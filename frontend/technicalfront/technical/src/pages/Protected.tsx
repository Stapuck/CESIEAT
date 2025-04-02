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

    return <Navigate to="/technical/tmplogin/" />;
}

export default Protected;
