import { useAuth } from "react-oidc-context";

function LoginButton() {
    const auth = useAuth();

    if (auth.isAuthenticated) {
        return (
            <button onClick={() => void auth.removeUser()}>
                Log out
            </button>
        );
    }

    return (
        <button onClick={() => void auth.signinRedirect()}>
            Log in
        </button>
    );
}

export default LoginButton;
