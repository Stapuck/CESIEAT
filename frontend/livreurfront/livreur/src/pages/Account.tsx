import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";

interface ILivreur {
  _id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: "Voiture" | "Moto" | "Vélo" | "Pieton" | "Autre";
  codeLivreur: string;
  livreurId_Zitadel: string;
  isAvailable: boolean;
}

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [livreurInfo, setLivreurInfo] = useState<ILivreur | null>(null);
  const [formData, setFormData] = useState<Partial<ILivreur>>({});
  const auth = useAuth();

  const getLivreurInfos = async () => {
    try {
      const response = await axios.get(
        `https://localhost/api/livreurs/byZitadelId/${auth.user?.profile.sub}`
      );
      setLivreurInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.user?.profile.sub) {
      getLivreurInfos();
    }
  }, [auth.user?.profile.sub]);

  useEffect(() => {
    if (livreurInfo) {
      setFormData({
        name: livreurInfo.name,
        email: livreurInfo.email,
        phone: livreurInfo.phone,
        vehicleType: livreurInfo.vehicleType,
        codeLivreur: livreurInfo.codeLivreur,
        isAvailable: livreurInfo.isAvailable,
      });
    }
  }, [livreurInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://localhost/api/livreurs/${livreurInfo?._id}`,
        formData
      );
      setLivreurInfo({ ...livreurInfo!, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-50  rounded-lg shadow-lg mt-30 p-8 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Informations du Compte Livreur
      </h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Véhicule:
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Voiture">Voiture</option>
              <option value="Moto">Moto</option>
              <option value="Vélo">Vélo</option>
              <option value="Pieton">Pieton</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700 text-lg">
            <span className="font-medium">Nom:</span> {livreurInfo?.name}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-medium">Email:</span> {livreurInfo?.email}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-medium">Téléphone:</span> {livreurInfo?.phone}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-medium">Type de Véhicule:</span>{" "}
            {livreurInfo?.vehicleType}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Modifier le Profil
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Account;
