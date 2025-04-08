
const AccountSettings = () => {
  const handlePasswordChange = () => {
    // Implémentation à venir
    alert('Fonctionnalité de changement de mot de passe à implémenter');
  };

  const handleLogout = () => {
    // Implémentation à venir
    alert('Fonctionnalité de déconnexion à implémenter');
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Paramètres
      </h2>
      
      <div className="flex space-x-4">
        <button 
          onClick={handlePasswordChange}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Changer le mot de passe
        </button>
        
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </section>
  );
};

export default AccountSettings;
