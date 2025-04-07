import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import LogoCompte from "../../assets/icons/person.circle.svg";

interface IClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientId_Zitadel: string;
}

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [clientInfo, setClientInfo] = useState<IClient | null>(null);
  const [formData, setFormData] = useState<Partial<IClient>>({});
  const auth = useAuth();

  const getClientInfos = async () => {
    try {
      const response = await axios.get(
        `https://localhost/api/clients/byZitadelId/${auth.user?.profile.sub}`
      );
      setClientInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.user?.profile.sub) {
      getClientInfos();
    }
  }, [auth.user?.profile.sub]);

  useEffect(() => {
    if (clientInfo) {
      setFormData({
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
        address: clientInfo.address,
      });
    }
  }, [clientInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://localhost/api/clients/${clientInfo?._id}`,
        formData
      );
      setClientInfo({ ...clientInfo!, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <img src={LogoCompte} alt="Logo Compte" className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Informations du Profil
      </h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse:
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 shadow-md rounded-md hover:cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 shadow-md rounded-md hover:cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Nom:</span> {clientInfo?.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {clientInfo?.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Phone:</span> {clientInfo?.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Adresse:</span> {clientInfo?.address}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 shadow-md rounded-md hover:cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Modifier le Profil
          </button>
        </div>
      )}
    </section>
  );
};

export default ProfileInfo;
