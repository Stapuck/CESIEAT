import { useAuth } from "react-oidc-context";


const Account = () => {
  const auth = useAuth();

  // console.log(auth); 
  // console.log(auth.user); 
  console.log(auth.user?.profile); 

  // auth.isAuthenticated
  
  return (
    <div>
      account 

      <p> id user : {auth.user?.profile.sub}</p>
      <p> id user : {auth.user?.profile.sub}</p>

    </div>
    
      
  )
 
};

export default Account;