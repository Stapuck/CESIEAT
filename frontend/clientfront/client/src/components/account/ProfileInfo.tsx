import React, { useState } from 'react';

interface ProfileInfoProps {
  name: string;
  email: string;
}

const ProfileInfo = ({ name, email }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Informations du Profil
      </h2>
      
      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Nom:</span> {name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {email}
        </p>
      </div>
      
      <button 
        onClick={() => setIsEditing(!isEditing)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isEditing ? 'Annuler' : 'Modifier le Profil'}
      </button>
    </section>
  );
};

export default ProfileInfo;
