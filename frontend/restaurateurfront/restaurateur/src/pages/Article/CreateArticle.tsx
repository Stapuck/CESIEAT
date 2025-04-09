import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "react-oidc-context";

interface IRestaurateur {
  _id: string;
  position: [number, number];
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  url_image: string;
  managerId_Zitadel: string;
}

const CreateArticle = () => {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState<number>();
  const [reference, setReference] = useState("");
  const [isInStock, setIsInStock] = useState(true);
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<IRestaurateur | null>(null);

  const navigate = useNavigate();

  const getRestaurateurByManagerId = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/restaurateurs/manager/${auth.user?.profile.sub}`
      );
      setRestaurant(response.data.length > 0 ? response.data[0] : null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveArticle = async (e: any) => {
    e.preventDefault();

    if (!name || !type || !price || !image) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("https://cesieat.nathan-lorit.com/api/articles", {
        name,
        type,
        price,
        isInStock,
        url_image: image,
        restaurantId: restaurant?._id,
        reference,
      });

      toast.success("Article créé avec succès");
      setIsLoading(false);
      navigate("/restaurateur/article");
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRestaurateurByManagerId();
  }, []);

  return (
    <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-25">
      <h2 className="font-semibold text-2xl mb-4 text-center">
        Créer un nouvelle article
      </h2>
      <form onSubmit={saveArticle}>
        <div className="space-y-2">
          <div>
            <label>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full block border p-3 rounded"
              placeholder="Nom"
            />
          </div>
          <div>
            <label>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full block border p-3 rounded"
            >
              <option value="">Sélectionnez un type</option>
              <option value="plat">Plat</option>
              <option value="boisson">Boisson</option>
              <option value="sauce">Sauce</option>
              <option value="accompagnement">Accompagnement</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label>Prix</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full block border p-3 rounded"
              placeholder="Prix"
            />
          </div>
          <div>
            <label>Réference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full block border p-3 rounded"
              placeholder="Reference"
            />
          </div>
          <div>
            <label>En stock</label>
            <input
              type="checkbox"
              checked={isInStock}
              onChange={(e) => setIsInStock(e.target.checked)}
              className="ml-2"
            />
          </div>
          <div>
            <label>Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full block border p-3 rounded"
              placeholder="URL de l'image"
            />
          </div>
          <div>
            <img
              src={image}
              alt="Image de l'article"
              className="w-full block border rounded"
            />
          </div>
          <div className="hidden">
            <label>ID du restaurant</label>
            <input
              type="text"
              value={restaurant?._id}
              className="w-full block border p-3 rounded"
              placeholder="ID du restaurant"
              readOnly
            />
          </div>
          <div>
            {!isLoading && (
              <div>
                <button className="block w-full mt-6 bg-tertiary text-white rounded px-4 py-2 font-bold hover:bg-tertiary transform hover:scale-105 transition duration-300">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="block w-full mt-4 bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-600 text-center hover:scale-105 transform transition duration-300"
                >
                  Retour
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
