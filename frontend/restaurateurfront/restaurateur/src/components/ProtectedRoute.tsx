import { useEffect, useState } from "react";
import { UserManager, User } from "oidc-client-ts";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

type Props = {
  authenticated: boolean | null;
  setAuth: (authenticated: boolean | null) => void;
  userManager: UserManager;
  handleLogout: any;
};

const ProtectedRoute = ({
  authenticated,
  setAuth,
  userManager

}: Props) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);


  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated === null) {
      userManager
        .signinRedirectCallback()
        .then((user: User) => {
          if (user) {
            setAuth(true);
            setUserInfo(user);
           
          } else {
            setAuth(false);
          }
        })
        .catch((error: any) => {
          console.log(error.message)
          setAuth(false);
        });
    }
    if (authenticated === true && userInfo === null) {
      userManager
        .getUser()
        .then((user) => {
          if (user) {
            setAuth(true);
            setUserInfo(user);
          } else {
            setAuth(false);
          }
        })
        .catch((error: any) => {
          console.log(error.message)
          setAuth(false);
        });
    }

    // if (!authenticated || userInfo === null){
    //   navigate('/restaurateur/login', {replace : true});
    // }
  }, [authenticated, userManager, setAuth]);

  // return (authenticated === true && userInfo) ? <Outlet/> : <>
  // {/* <Navigate to='/restaurateur/home'/> */}
  // {/* return <Navigate to="/restaurateur/login" replace />; */}
  // {/* <div>
  //   Vous n'avez pas accès à cette page, Veuillez vous connecter 
  
  // </div> */}
  // </>
  
  return <Outlet/>

};

export default ProtectedRoute;