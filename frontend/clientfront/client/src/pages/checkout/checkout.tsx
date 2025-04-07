import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import Swal from "sweetalert2";
import CreditCard from "../../assets/icons/creditcard.fill.svg";
import ApplePay from "../../assets/shop/Apple_Pay_Mark_RGB_041619.svg";
import GooglePay from "../../assets/shop/Google_Pay_Logo.svg";
import PaypalPay from "../../assets/shop/logo_paypal_paiements_fr.png";
import axios from "axios";
import { useAuth } from "react-oidc-context";

const Checkout: React.FC = () => {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const auth = useAuth();
  const zitadelId = auth.user?.profile.sub;
  
  const [customerInfo, setCustomerInfo] = useState({
    name: `${auth.user?.profile.family_name || ""} ${
      auth.user?.profile.given_name || ""
    }`.trim(),
    email: auth.user?.profile.email || "",
    address: "",
    clientId_Zitadel: zitadelId,
  });
  
  React.useEffect(() => {
    const fetchClientAddress = async () => {
      if (zitadelId) {
        try {
          const response = await axios.get(`https://localhost/api/clients/byZitadelId/${zitadelId}`);
          if (response.data && response.data.address) {
            setCustomerInfo(prev => ({
              ...prev,
              address: response.data.address
            }));
          }
        } catch (error) {
          console.error("Failed to fetch client address:", error);
        }
      }
    };
    
    fetchClientAddress();
  }, [zitadelId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    try {
      let timerInterval: any;
      await Swal.fire({
        title: "Traitement du paiement...",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup()?.querySelector("b");
          timerInterval = setInterval(() => {
            if (timer) {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      // Create a separate order for each menu item
      for (const item of cartItems) {
        const payload = {
          clientId_Zitadel: customerInfo.clientId_Zitadel,
          restaurantId: item.restaurantId,
          menuId: item.id,
          totalAmount: item.price * item.quantity,
          status: "En attente",
        };

        await axios.post("https://localhost/api/commandes", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }


      Swal.fire({
        title: "Paiement réussi !",
        icon: "success",
        text: "Votre commande a été passée avec succès !",
      });

      clearCart();
      navigate("/client/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la validation de votre commande. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Validation de la commande</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Vos articles</h2>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x {item.price.toFixed(2)} €
                  </p>
                </div>
                <p className="font-medium text-amber-600">
                  {(item.quantity * item.price).toFixed(2)} €
                </p>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold mt-4">
            Total : {getTotalPrice().toFixed(2)} €
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations client</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
            <div className="flex max-h-10 space-x-4">
              <img
                className="h-10 cursor-pointer"
                src={ApplePay}
                alt="Apple Pay"
              />
              <img
                className="h-10 cursor-pointer"
                src={GooglePay}
                alt="Google Pay"
              />
              <img
                className="h-10 cursor-pointer"
                src={PaypalPay}
                alt="PayPal"
              />
            </div>

            <h2 className="text-xl font-light mb-4">Carte bancaire</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom sur la carte
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="Nom et prénom"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numéro de carte
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date d'expiration
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/AA"
                  maxLength={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="ccv"
                  className="block text-sm font-medium text-gray-700"
                >
                  CCV
                </label>
                <input
                  type="text"
                  id="ccv"
                  name="ccv"
                  placeholder="123"
                  maxLength={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-medium transition-colors w-full"
            >
              <img
                className="w-6 inline-block mr-2"
                src={CreditCard}
                alt="Carte bancaire"
              />
              Payer la commande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

