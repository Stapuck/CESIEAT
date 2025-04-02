import React, { useState } from "react";
import { useAuth } from "react-oidc-context";



const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const auth = useAuth(); // Utiliser le hook pour accéder aux informations d'authentification

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Informations du Profil
      </h2>

      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Nom:</span> {auth.user?.profile.family_name} {auth.user?.profile.given_name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {auth.user?.profile.email}
        </p>
      </div>

      <button
        onClick={() => setIsEditing(!isEditing)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isEditing ? "Annuler" : "Modifier le Profil"}
      </button>
    </section>
  );
};

export default ProfileInfo;
