import BackgroundFood from "../assets/background_food.jpg";
import Quote from "../assets/quote.svg";
import InversedQuote from "../assets/quote_inversed.svg";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { toast } from "react-toastify";
import { useLogger } from "../hooks/useLogger";

const Hero = () => {
  const messages = [
    "Plus rapide qu'un micro-ondes, meilleur qu'un resto !",
    "Commandez vos plats préférés en un clic !",
    "Livraison rapide et délicieuse à votre porte !",
  ];
  const auth = useAuth();
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logger = useLogger();

  const createClient = async () => {
    try {
      // Verify user profile exists
      if (!auth.user?.profile) {
        logger({
          type: "error",
          message: "User profile not available",
          clientId_Zitadel: auth.user?.profile?.sub || "unknown",
        });
        return;
      }

      const {
        given_name,
        family_name,
        email,
        sub: zitadelId,
      } = auth.user.profile;

      if (!given_name || !family_name || !email || !zitadelId) {
        logger({
          type: "error",
          message: "Required user profile data missing",
          clientId_Zitadel: auth.user?.profile?.sub || "unknown",
        });
        return;
      }

      // Prepare client data
      const clientData = {
        name: `${given_name} ${family_name}`,
        email,
        phone: "Empty", // Default value
        address: "Empty", // Default value
        isPaused: false,
        clientId_Zitadel: zitadelId,
      };

      try {
        // Try to fetch existing client data
        const response = await axios.get(
          `https://localhost/api/clients/byZitadelId/${zitadelId}`,
          { headers: { Accept: "application/json" } }
        );

        // Client exists - preserve existing phone and address
        const existingClient = response.data;
        clientData.phone = existingClient.phone || clientData.phone;
        clientData.address = existingClient.address || clientData.address;

        // Update the existing client
        await axios.put(
          `https://localhost/api/clients/byZitadelId/${zitadelId}`,
          clientData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      } catch (error: any) {
        // Check if error is due to client not existing (404)
        if (error.response?.status === 404) {
          // Create new client
          await axios.post("https://localhost/api/clients", clientData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
          logger({
            type: "info",
            message: `New client created for user ${given_name} ${family_name}`,
            clientId_Zitadel: zitadelId,
          });
        } else {
          // Handle other API errors
          logger({
            type: "error",
            message: `Error synchronizing user data: ${error.message}`,
            clientId_Zitadel: zitadelId,
          });
          toast.error("Error synchronizing user data");
          throw error; // Re-throw for outer catch
        }
      }
    } catch (error: any) {
      logger({
        type: "error",
        message: `Failed to sync user profile: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      toast.error("Failed to sync your profile. Please try again later.");
    }
  };

  // Vérifier et créer le client lorsque l'utilisateur se connecte
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      createClient();
      logger({
        type: "info",
        message: `User ${auth.user.profile.name} authenticated successfully`,
        clientId_Zitadel: auth.user.profile.sub,
      });
    }
  }, [auth.isAuthenticated, auth.user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleSubmitPost = async (e: any) => {
    e.preventDefault();

    if (!auth.isAuthenticated || !postContent.trim()) {
      toast.error("Vous devez être connecté et écrire un message");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupération du token d'authentification
      const token = auth.user?.access_token;

      // Configuration de la requête avec en-têtes d'autorisation
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Effectuer la requête POST avec une URL API correcte
      await axios.post(
        "/api/posts", // Remplacez par l'URL correcte de votre API
        { content: postContent },
        config
      );

      // Succès
      toast.success("Votre message a été publié avec succès!");
      setPostContent("");

      // Vous pourriez faire quelque chose avec la réponse ici
    } catch (error: any) {
      // Gestion des erreurs
      logger({
        type: "error",
        message: `Error publishing post: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      toast.error(
        `Erreur: ${
          error.response?.data?.message || "Impossible de publier votre message"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-center hero-content relative items-center z-0 bg-cover bg-center h-full w-full overflow-clip mt-1 bg-no-repeat"
      style={{ backgroundImage: `url(${BackgroundFood})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.0,
          scale: { type: "spring", visualDuration: 0.0, bounce: 0.0 },
        }}
        className="relative items-center mx-2 mb-6 z-10 mt-10 rounded-3xl shadow-2xl bg-transparent-background p-8 sm:w-screen]"
      >
        <h1 className="text-5xl font-extrabold p-8">
          Bienvenue {auth.user?.profile.given_name} sur{" "}
          <span className="bg-gradient-to-r from-gradient-left to-gradient-right bg-clip-text font-extrabold text-transparent">
            C.H.E.F.
          </span>
        </h1>

        <img
          src={Quote}
          alt="Quote"
          className="p-4 max-w-sm object-contain z-10"
        />
        <p className="text-center font-bold italic">{currentMessage}</p>

        <div className="flex justify-end items-end">
          <img
            src={InversedQuote}
            alt="Inversed Quote"
            className="p-4 max-w-sm object-contain z-10"
          />
        </div>

        {/* Formulaire de publication pour les utilisateurs authentifiés */}
        {auth.isAuthenticated && (
          <div className="mt-8 p-6 bg-white bg-opacity-90 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Partagez votre expérience
            </h2>
            <form onSubmit={handleSubmitPost}>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Partagez votre avis sur nos plats..."
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded transition-colors duration-200 flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="https://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  "Publier"
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Hero;
