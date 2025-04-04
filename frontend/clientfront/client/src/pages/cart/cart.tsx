import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart.ts";
import FaTrash from "../../assets/icons/trash.fill.svg";
import FaPlus from "../../assets/icons/plus.square.svg";
import FaMinus from "../../assets/icons/minus.square.svg";
import FaArrowLeft from "../../assets/icons/arrow.left.square.svg";
import FaShoppingBag from "../../assets/icons/bag.svg";
import axios from "axios";
import Swal from "sweetalert2";

// Définir un type pour les articles du panier
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
};

const ShoppingCart: React.FC = () => {
  const { cartItems, removeItemFromCart, getTotalPrice, updateItemQuantity } =
    useCart();
  const navigate = useNavigate();
  const [restaurantNames, setRestaurantNames] = useState<
    Record<string, string>
  >({}); // État pour stocker les noms des restaurants
  const [voucherCode, setVoucherCode] = useState<string>(""); // État pour stocker le code promo

  // Charger les noms des restaurants
  useEffect(() => {
    const fetchRestaurantNames = async () => {
      // Aplatir les IDs des restaurants et les dédupliquer
      const uniqueRestaurantIds = Array.from(
        new Set(
          cartItems.flatMap((item) =>
            Array.isArray(item.restaurantId)
              ? item.restaurantId
              : [item.restaurantId]
          )
        )
      );

      const names: Record<string, string> = {};

      await Promise.all(
        uniqueRestaurantIds.map(async (id) => {
          try {
            const response = await axios.get(
              `https://cesieat.com/api/restaurateurs/${id}`
            );
            names[id] = response.data.restaurantName || "Inconnu";
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du nom du restaurant ${id}:`,
              error
            );
            names[id] = "Inconnu";
          }
        })
      );

      setRestaurantNames(names);
    };

    if (cartItems.length > 0) {
      fetchRestaurantNames();
    }
  }, [cartItems]);

  // Vérifier si le panier est vide
  const isCartEmpty = cartItems.length === 0;

  // Gérer la modification de la quantité
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Supprimer l'article si la quantité est inférieure ou égale à 0
      removeItemFromCart(item.id);
    } else {
      updateItemQuantity(item.id, newQuantity); // Mettre à jour la quantité directement
    }
  };

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez entrer un code promo valide.",
      });
      return;
    }

    // Simuler l'application du code promo
    Swal.fire({
      icon: "success",
      title: "Code promo appliqué",
      text: `Le code promo "${voucherCode}" a été appliqué avec succès !`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    // Réinitialiser le champ du code promo
    setVoucherCode("");
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-amber-500 mr-4 mb-5"
        >
          <img src={FaArrowLeft} alt="Retour" className="ml-2 mr-4" /> Retour
        </button>
      </div>

      {isCartEmpty ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <img
              src={FaShoppingBag}
              alt="Panier"
              className="w-24 h-24 text-gray-300"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">
            Ajoutez des articles pour continuer vos achats !
          </p>
          <Link
            to="/client"
            className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-full font-medium transition-colors"
          >
            Explorer les produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex justify-between  items-center p-4 my-4 rounded-lg bg-white border-b last:border-0"
              >
                <div className="flex items-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt="item"
                      className="w-16 h-16 rounded-md mr-4"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      Restaurant :{" "}
                      {restaurantNames[item.restaurantId] || "Chargement..."}
                    </p>
                    <p className="text-gray-600">
                      {item.price.toFixed(2)} € / unité
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(item, item.quantity - 1)
                    }
                    className="w-5 rounded-2xl hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-200"
                  >
                    <img className="w-full" src={FaMinus} alt="-" />
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item, item.quantity + 1)
                    }
                    className="w-5 rounded-2xl hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-200"
                  >
                    <img className="w-full" src={FaPlus} alt="+" />
                  </button>
                  <span className="font-medium text-amber-700 ml-4">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="w-5 ml-5 rounded-2xl hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-200"
                  >
                    <img className="w-full" src={FaTrash} alt="Supprimer" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Résumé de la commande
            </h2>
            <p className="text-gray-600 mb-2">
              Total des articles : {cartItems.length}
            </p>
            <p className="text-gray-600 mb-4">
              Prix total :{" "}
              <span className="font-bold">{getTotalPrice().toFixed(2)} €</span>
            </p>
            <h2 className="text-xl font-semibold mb-4">Code Promo</h2>
            <div className="flex items-center my-3">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)} // Mettre à jour l'état du code promo
                placeholder="Entrez votre code promo"
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleApplyVoucher}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg font-medium transition-colors"
              >
                Appliquer
              </button>
            </div>
            <button
              onClick={() => navigate("/client/checkout")}
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-medium transition-colors w-full"
            >
              Passer à la caisse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
