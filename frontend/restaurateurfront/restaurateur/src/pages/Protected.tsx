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
        return <div>Oops... {auth.error.kind} caused {auth.error.message}</div>;
    }


    if (auth.isAuthenticated) {
    console.log(" 🟩 AUTH")
        return (
            <div>
                Hello {auth.user?.profile.sub}{" "}
                <button onClick={() => void auth.removeUser()}>Log out</button>
                <Outlet></Outlet>
            </div>
        );
    }

    console.log("🤡 NOT AUTH")

    return <Navigate to ="/login"/>


    // return (
    //     <div>
            // <button onClick={() => setUser(!user)}>login</button>
    //         <br />
    //         <div>{user ? "jon" : "not auth"}</div>
    //         {user ? <Outlet></Outlet> : <Navigate to={"/login"} />}
    //         {/* {user ? <Outlet></Outlet> : <div>not auth</div>} */}
    //     </div>
    // );
}

export default Protected;
