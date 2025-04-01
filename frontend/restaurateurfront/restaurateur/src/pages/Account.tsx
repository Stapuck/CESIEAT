import { useAuth } from "react-oidc-context";

const Account = () => {
  const auth = useAuth();

  console.log("Profil utilisateur :", auth.user?.profile);

  const roles = auth.user?.profile["urn:zitadel:iam:org:project:roles"];
  const roleEntries = roles ? Object.entries(roles) : [];

  // const name = auth.user?.profile["urn:zitadel:iam:org:project:user"];

  return (
    <div>
      <h2>Account </h2>
      <p><strong>email  :</strong> {auth.user?.profile.email}</p>
      <p><strong>ID utilisateur :</strong> {auth.user?.profile.sub}</p>
      <p><strong>name  :</strong> {auth.user?.profile.family_name}</p>
      <p><strong>last name :</strong> {auth.user?.profile.given_name}</p>
      <p><strong>Rôles :</strong> </p>
      {roleEntries.length > 0 ? (
        <ul>
          {roleEntries.map(([role, value]) => (
            <li key={value}>
              <p>{role} </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun rôle trouvé</p>
      )}
    </div>
  );
};

export default Account;
