import React, { useEffect, useState } from "react";
import {
  useLocation as useRestaurant,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useCart from "../../hooks/useCart";
import { motion } from "motion/react";
import { useAuth } from "react-oidc-context";

interface Menu {
  _id: string;
  name: string;
  price: number;
  articles: any[];
  restaurateurId: string;
  createdAt: string;
  updatedAt: string;
  url_image: string;
}

interface RestaurantState {
  restaurantId: string;
  restaurantName?: string;
  restaurantImage?: string;
}

interface Article {
  _id: string;
  name: string;
  price: number;
  url_image: string;
  type?: string;
  isInStock?: boolean;
}

interface ShowRestaurantMenuProps {
  login?: boolean;
}

interface OutletContextType {
  login: boolean;
}

const ShowRestaurantMenu: React.FC<ShowRestaurantMenuProps> = (props) => {
  // Récupérer l'état de connexion de multiples sources
  const outletContext = useOutletContext<OutletContextType | null>();
  const auth = useAuth(); // Récupération directe de l'état d'authentification

  // Utiliser auth.isAuthenticated comme source primaire, puis les props, puis le contexte outlet
  const login =
    auth.isAuthenticated || props.login || outletContext?.login || false;

  // Log pour débogage
  useEffect(() => {
    console.log("État de connexion:", {
      authIsAuthenticated: auth.isAuthenticated,
      propsLogin: props.login,
      outletContextLogin: outletContext?.login,
      finalLogin: login,
    });
  }, [auth.isAuthenticated, props.login, outletContext, login]);

  const restaurant = useRestaurant();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const state = restaurant.state as RestaurantState | null;
  const { addItemToCart } = useCart();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantImage, setRestaurantImage] = useState<string>("");
  const [articles, setArticles] = useState<Record<string, Article>>({});
  const [restaurantId, setRestaurantId] = useState<string>("");

  useEffect(() => {
    // Si on n'a pas d'état (accès direct à l'URL), afficher un message et rediriger
    if (!state || !state.restaurantId) {
      toast.error(
        "Information de restaurant manquante. Redirection vers l'accueil..."
      );
      navigate("/client/");
      return;
    }

    // Stocker l'ID du restaurant dans l'état local seulement si c'est une valeur valide
    if (state.restaurantId && /^[0-9a-fA-F]{24}$/.test(state.restaurantId)) {
      setRestaurantId(state.restaurantId);
    }

    if (state.restaurantName) {
      setRestaurantName(state.restaurantName);
      // Mettre à jour le titre de la page pour SEO
      document.title = `Menus de ${state.restaurantName} | CESIEAT`;
    }

    if (state.restaurantImage) {
      setRestaurantImage(state.restaurantImage);
    }
  }, [state, navigate, slug]);

  // Séparons l'effet de chargement des menus pour éviter les cycles de re-rendu
  useEffect(() => {
    const fetchMenus = async () => {
      if (!restaurantId || !/^[0-9a-fA-F]{24}$/.test(restaurantId)) {
        return; // N'exécute pas la requête si on n'a pas d'ID valide
      }

      try {
        setLoading(true);

        // Récupérer tous les menus
        const response = await axios.get("https://cesieat.nathan-lorit.com/api/menus");

        if (response.data && response.data.length > 0) {
          // Filtrer les menus par restaurant

          const filteredMenus = response.data.filter((menu: Menu) => {
            if (Array.isArray(menu.restaurateurId)) {
              return menu.restaurateurId.includes(restaurantId);
            } else {
              return menu.restaurateurId === restaurantId;
            }
          });
          if (filteredMenus.length > 0) {
            setMenus(filteredMenus);
          } else {
            toast.warn("Aucun menu disponible pour ce restaurateur.");
            setMenus([]);
          }
        } else {
          toast.warn("Aucun menu disponible.");
          setMenus([]);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("Erreur lors de la récupération des menus.");
        } else {
          toast.error("Impossible de charger les menus.");
        }
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurantId]); // On ne dépend que de l'ID du restaurant

  const fetchArticleDetails = async (id: string) => {
    if (articles[id]) return;

    try {
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/articles/${id}`
      );
      setArticles((prev) => ({
        ...prev,
        [id]: {
          ...response.data,
          isInStock: response.data.isInStock ?? true,
          type: response.data.type ?? "Non spécifié",
        },
      }));
      return response.data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    // Préchargement des articles
    const fetchAllArticles = async () => {
      const articleIds = menus.flatMap((menu) =>
        menu.articles.map((articleId) => articleId)
      );

      const uniqueArticleIds = [...new Set(articleIds)];

      for (const articleId of uniqueArticleIds) {
        if (!articles[articleId]) {
          await fetchArticleDetails(articleId);
        }
      }
    };

    if (menus.length > 0) {
      fetchAllArticles();
    }
  }, [menus]);

  const handleAddToCart = (menu: Menu) => {
    if (!menu._id || !menu.restaurateurId) {
      toast.error(
        "Impossible d'ajouter ce menu au panier: informations manquantes"
      );
      return;
    }

    try {
      const itemToAdd = {
        id: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: 1,
        restaurantId: menu.restaurateurId,
        image: articles[menu.articles[0]]?.url_image || "",
      };

      addItemToCart(itemToAdd);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${menu.name} a été ajouté à votre panier`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      toast.error("Impossible d'ajouter ce menu au panier");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="relative mb-6 w-full">
        <img
          className="bg-cover w-full h-100 object-cover bg-center"
          src={restaurantImage}
          alt="Restaurant"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.0,
            scale: { type: "spring", visualDuration: 0.0, bounce: 0.0 },
          }}
          className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50"
        >
          <h1 className="text-3xl text-black bg-gradient-left p-3 outline-4 px-5 shadow-2xl font-extrabold">
            {restaurantName
              ? `Menus de ${restaurantName}`
              : "Menus du restaurant"}
          </h1>
        </motion.div>
      </div>

      {menus.length > 0 ? (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Nos menus</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <motion.div
                key={menu._id}
                className="relative bg-transparent-background rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundImage: `url(${menu.url_image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",

                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="relative p-4">
                  <h2 className="text-2xl font-bold text-black bg-transparent-background  mb-3">{menu.name}</h2>
                  <div className="mb-4 bg-transparent-background p-6 rounded-lg shadow-md">
                    <h3 className="font-medium underline mb-2">Contenu du menu:</h3>
                    <ul className="divide-y divide-gray-200">
                      {menu.articles && menu.articles.length > 0 ? (
                        menu.articles.map((articleId, index) => {
                          const articleDetails = articles[articleId];
                          if (!articleDetails) {
                            fetchArticleDetails(articleId);
                          }

                          return (
                            <li
                              key={`${menu._id}-${articleId}-${index}`}
                              className="py-2"
                            >
                              <div className="flex flex-col md:flex-row">
                                {articleDetails?.url_image && (
                                  <img
                                    src={articleDetails.url_image}
                                    alt={articleDetails.name || ""}
                                    className="w-20 h-20 object-cover rounded-lg mr-3 mb-2 md:mb-0"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {articleDetails?.name || "Chargement..."}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {articleDetails?.type || "Chargement..."}
                                  </p>
                                  <p className={`text-sm ${articleDetails?.isInStock ? "text-green-600" : "text-red-600"}`}>
                                    {articleDetails?.isInStock
                                      ? "En stock"
                                      : "Rupture de stock"}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <li key={`${menu._id}-no-articles`}>
                          Aucun article disponible pour ce menu.
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center justify-center bg-transparent-background p-6 rounded-lg shadow-md"> 
                      <span className="text-2xl font-bold text-center text-amber-600 mr-2">
                        {menu.price.toFixed(2)} €
                      </span>
                      <i className="fas fa-utensils text-amber-500"></i>
                    </div>
                    {(login === true || auth.isAuthenticated === true) && (
                      <button
                        onClick={() => handleAddToCart(menu)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Ajouter au panier
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            Aucun menu disponible pour ce restaurant.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowRestaurantMenu;
