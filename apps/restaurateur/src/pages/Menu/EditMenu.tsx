import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "react-oidc-context";

interface IRestaurateur {
  _id: string;
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  position: [number, number];
  url_image: string;
  managerId: string;
}

const EditMenu = () => {
  const auth = useAuth();
  const { id } = useParams<{ id: string }>(); // Récupération de l'ID du menu via l'URL
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>();
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<IRestaurateur>();
  const navigate = useNavigate();

  const getArticlesByRestaurant = async () => {
    try {
      if (!restaurant?._id) {
        console.log("ID du restaurant non disponible");
        return;
      }
      
      const response = await axios.get(
        `https://cesieat.com/api/articles/restaurateur/${restaurant._id}`
      );

      setArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRestaurateurByManagerId = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `https://cesieat.com/api/restaurateurs/manager/${auth.user?.profile.sub}`
      );
      
      // S'assurer que nous récupérons le premier élément du tableau
      if (response.data && response.data.length > 0) {
        setRestaurant(response.data[0]);
      } else {
        console.log("Aucun restaurateur trouvé");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`https://cesieat.com/api/menus/${id}`);
      const menu = response.data;
      setName(menu.name);
      setPrice(menu.price);
      setSelectedArticles(menu.articles);
    } catch (error) {
      console.error("Erreur lors de la récupération du menu", error);
    }
  };

  useEffect(() => {
    getRestaurateurByManagerId();
  }, []);

  useEffect(() => {
    if (restaurant?._id) {
      getArticlesByRestaurant();
      fetchMenu();
    }
  }, [id, restaurant]);

  const handleArticleChange = (index: number, value: string) => {
    const updatedArticles = [...selectedArticles];
    updatedArticles[index] = value;
    setSelectedArticles(updatedArticles);
    calculateTotalPrice(updatedArticles);
  };

  const handleRemoveArticle = (index: number) => {
    const updatedArticles = [...selectedArticles];
    updatedArticles.splice(index, 1); // Supprime l'article à l'index donné
    setSelectedArticles(updatedArticles);
    calculateTotalPrice(updatedArticles);
  };

  const saveMenu = async (e: any) => {
    e.preventDefault();

    if (!name || !price || selectedArticles.length === 0) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`https://cesieat.com/api/menus/${id}`, {
        name,
        price,
        articles: selectedArticles,
      });

      toast.success("Menu mis à jour avec succès");
      setIsLoading(false);
      navigate("/restaurateur/menu");
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = (selected: any[]) => {
    const total = selected.reduce((sum, articleId) => {
      const article = articles.find((a) => a._id === articleId);
      return article ? sum + article.price : sum;
    }, 0);
    setPrice(total);
  };

  // todo faire un foreach selectedArticles fetcharticlebyId puis afficher via la cardarticle sans les modifier et suprimer.
  return (
    <div className="max-w-lg bg-white shadow-lg mx-auto  p-7 rounded mt-25">
      <h2 className="font-semibold text-2xl mb-4 text-center">
        Éditer un Menu
      </h2>
      <form onSubmit={saveMenu}>
        <div className="space-y-2">
          <div>
            <label>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full block border p-3 rounded"
              placeholder="Nom du menu"
            />
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
            <label>Articles</label>
            {selectedArticles.map((selectedArticle, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <select
                  value={selectedArticle}
                  onChange={(e) => handleArticleChange(index, e.target.value)}
                  className="w-full block border p-3 rounded mt-2"
                >
                  <option value="">Sélectionnez un article</option>
                  {Object.entries(
                    articles.reduce((acc: any, article: any) => {
                      if (!acc[article.type]) acc[article.type] = [];
                      acc[article.type].push(article);
                      return acc;
                    }, {})
                  ).map(([type, articles]) => (
                    <optgroup key={type} label={type}>
                      {(articles as any[]).map((article) => (
                        <option key={article._id} value={article._id}>
                          {article.name} ({article.type}) - {article.price}€
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveArticle(index)}
                  className="bg-red-500 text-white px-2 py-1 mt-2 w-[33px]  rounded transform hover:scale-105 transition duration-300"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSelectedArticles([...selectedArticles, ""])}
              className="mt-2 bg-primary  text-black px-3 py-1  rounded transform hover:scale-105 transition duration-300"
            >
              + Ajouter un article
            </button>
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
                  className="block w-full mt-4 bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-600 text-center transform hover:scale-105 transition duration-300"
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

export default EditMenu;
