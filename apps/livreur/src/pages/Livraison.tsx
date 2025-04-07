import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Livraison() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log("ID de la commande :", id);
    // Ici, tu peux récupérer les détails de la commande en utilisant cet ID
  }, [id]);

  return (
    <div>
      <h1>Page Livraison</h1>
      <p>ID de la commande : {id}</p>
      {/* Ici, tu peux afficher ou gérer la commande */}
    </div>
  );
}
