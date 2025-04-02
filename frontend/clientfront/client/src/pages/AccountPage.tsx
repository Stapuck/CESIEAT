import React from "react";
import ProfileInfo from "../components/account/ProfileInfo";
import OrderHistory from "../components/account/OrderHistory";
import QRCodeGenerator from "../components/account/QRCodeGenerator";

const AccountPage = () => {
  // ID client fictif (à remplacer par l'ID réel depuis l'authentification)
  const clientId = "67e3dbf470e981b549cd0fde";
  const clientName = "John Doe";

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
        Mon Profil
      </h1>

      <ProfileInfo name={clientName} email="john.doe@example.com" />
      <OrderHistory />
    </div>
  );
};

export default AccountPage;
