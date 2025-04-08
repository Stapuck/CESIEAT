import { useState, useEffect, useCallback } from 'react';

// Définition du type CartItem
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
}

// Type pour les paramètres d'entrée optionnels lors de l'ajout d'un article
export type CartItemInput = Omit<CartItem, 'quantity'> & { quantity?: number };

const useCart = () => {
  // Initialiser le panier depuis localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      return [];
    }
  });

  // Sauvegarder dans localStorage quand le panier change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un article au panier ou augmenter sa quantité s'il existe déjà
  const addItemToCart = useCallback((item: CartItemInput) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        const existingItem = newItems[existingItemIndex];
        const quantityToAdd = item.quantity || 1;

        const updatedQuantity = existingItem.quantity + quantityToAdd;
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: updatedQuantity
        };
        return newItems;
      } else {
        const initialQuantity = item.quantity || 1;
        return [...prevItems, { ...item, quantity: initialQuantity }];
      }
    });
  }, []);

  // Mettre à jour la quantité d'un article
  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex === -1) return prevItems;

      const newItems = [...prevItems];
      newItems[itemIndex] = { ...newItems[itemIndex], quantity }; // Mise à jour directe de la quantité
      return newItems;
    });
  }, []);


  // Supprimer un article du panier
  const removeItemFromCart = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  // Vider le panier
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculer le prix total
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Obtenir le nombre total d'articles
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
};

export default useCart;