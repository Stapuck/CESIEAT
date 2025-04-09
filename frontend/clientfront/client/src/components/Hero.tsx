import BackgroundFood from "../assets/background_food.jpg";
import Quote from "../assets/quote.svg";
import InversedQuote from "../assets/quote_inversed.svg";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { toast } from "react-toastify";
import CommentSlider from "../components/commentaire/CommentSlider";
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
        console.error("Required user profile data missing", {
          given_name,
          family_name,
          email,
          zitadelId,
        });
        return;
      }

      const clientData = {
        name: `${given_name} ${family_name}`,
        email,
        phone: "Empty",
        address: "Empty",
        isPaused: false,
        clientId_Zitadel: zitadelId,
      };

      try {
        const response = await axios.get(
          `https://cesieat.nathan-lorit.com/api/clients/byZitadelId/${zitadelId}`,
          { headers: { Accept: "application/json" } }
        );

        const existingClient = response.data;
        clientData.phone = existingClient.phone || clientData.phone;
        clientData.address = existingClient.address || clientData.address;

        await axios.put(
          `https://cesieat.nathan-lorit.com/api/clients/byZitadelId/${zitadelId}`,
          clientData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("Client updated successfully");
      } catch (error: any) {
        if (error.response?.status === 404) {
          await axios.post("https://cesieat.nathan-lorit.com/api/clients", clientData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
        } else {
          logger({
            type: "error",
            message: `Error synchronizing user data: ${error.message}`,
            clientId_Zitadel: zitadelId,
          });
          toast.error("Error synchronizing user data");
          throw error;
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitPost = async (e: any) => {
    e.preventDefault();

    if (!auth.isAuthenticated || !postContent.trim()) {
      toast.error("Vous devez être connecté et écrire un message");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("https://cesieat.nathan-lorit.com/api/commentaires", {
        commentaire: postContent,
        clientId_Zitadel: auth.user?.profile.sub,
      });

      toast.success("Votre message a été publié avec succès!");
      setPostContent("");
    } catch (error: any) {
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
        className="relative items-center w-[95%] md:w-[85%] lg:w-[80%] mx-auto mb-6 z-10 mt-16 sm:mt-20 md:mt-24 rounded-3xl shadow-2xl bg-transparent-background p-4 sm:p-6 md:p-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold p-3 sm:p-4 md:p-8 text-center md:text-left">
          Bienvenue {auth.user?.profile.given_name} sur{" "}
          <span className="bg-gradient-to-r from-gradient-left to-gradient-right bg-clip-text font-extrabold text-transparent">
            C.H.E.F.
          </span>
        </h1>

        <div className="flex flex-col px-2 sm:px-4">
          <img
            src={Quote}
            alt="Quote"
            className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain z-10 self-start"
          />
          
          <p className="text-center font-bold italic text-sm sm:text-base md:text-lg py-2 md:py-4">
            {currentMessage}
          </p>

          <img
            src={InversedQuote}
            alt="Inversed Quote"
            className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain z-10 self-end"
          />
        </div>

        {auth.isAuthenticated && (
          <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 bg-white bg-opacity-90 rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-800">
              Partagez votre expérience
            </h2>
            <form onSubmit={handleSubmitPost}> 
              <textarea
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2 sm:mb-4 text-sm sm:text-base"
                placeholder="Partagez votre avis sur nos plats..."
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded transition-colors duration-200 flex items-center justify-center text-sm sm:text-base`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
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
                    Envoi...
                  </>
                ) : (
                  "Publier"
                )}
              </button>
            </form>
          </div>
        )}
        
        <div className="mt-4 sm:mt-5">
          <CommentSlider />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
