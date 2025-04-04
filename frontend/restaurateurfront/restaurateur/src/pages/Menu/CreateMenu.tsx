import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const CreateMenu = () => {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>();
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<any[]>([]);
  const [urlImage, setUrlImage] = useState("");
  const [restaurant, setRestaurant] = useState<IRestaurateur>();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getRestaurateurByManagerId = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/restaurateurs/manager/${auth.user?.profile.sub}`
      );
      if (response.data.length > 0) {
        setRestaurant(response.data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getArticlesByRestaurant = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/articles/restaurateur/${restaurant?._id}`
      );
      setArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRestaurateurByManagerId();
  }, []);

  useEffect(() => {
    if (restaurant?._id) {
      getArticlesByRestaurant();
    }
  }, [restaurant]);

  const handleAddArticle = () => {
    setSelectedArticles([...selectedArticles, ""]);
  };

  const handleArticleChange = (index: number, value: string) => {
    const updatedArticles = [...selectedArticles];
    updatedArticles[index] = value;
    setSelectedArticles(updatedArticles);
    calculateTotalPrice(updatedArticles);
  };

  const handleRemoveArticle = (index: number) => {
    const updatedArticles = [...selectedArticles];
    updatedArticles.splice(index, 1);
    setSelectedArticles(updatedArticles);
    calculateTotalPrice(updatedArticles);
  };

  const saveMenu = async (e: any) => {
    e.preventDefault();

    if (!name || !price || !urlImage || selectedArticles.length === 0) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("http://localhost:8080/api/menus", {
        name,
        price,
        articles: selectedArticles,
        restaurateurId: restaurant?._id,
        url_image: urlImage,
      });

      toast.success("Menu créé avec succès");
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

  return (
    <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
      <h2 className="font-semibold text-2xl mb-4 text-center">Créer un Menu</h2>
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
            <label>Image</label>
            <input
              type="text"
              value={urlImage}
              onChange={(e) => setUrlImage(e.target.value)}
              className="w-full block border p-3 rounded"
              placeholder="Url Image"
            />
          </div>
          <div>
            <img
              src={urlImage}
              alt="Image du menu"
              className="w-full block border  rounded"
            />
          </div>

          <div className="hidden">
            <label>Restaurateur (temporaire )</label>
            <input
              type="string"
              readOnly
              value={restaurant?._id}
              className="w-full block border p-3 rounded"
              placeholder="id"
            />
          </div>

          <div>
            {selectedArticles.length > 0 ? (
              <label className="my-4">Articles</label>
            ) : (
              <label className="my-4 mx-2">Choissiez des articles</label>
            )}
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
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddArticle}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              +
            </button>
          </div>
          <div>
            {!isLoading && (
              <div>
                <button className="block w-full mt-6 bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-600">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="block w-full mt-4 bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-600 text-center"
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

export default CreateMenu;
