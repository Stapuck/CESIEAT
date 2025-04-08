import ProfileInfo from "../components/account/ProfileInfo";
import OrderHistory from "../components/account/OrderHistory";

const AccountPage = () => {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
        Mon Profil
      </h1>

      <ProfileInfo />
      <OrderHistory />
    </div>
  );
};

export default AccountPage;
