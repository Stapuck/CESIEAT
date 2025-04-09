import Comment from "./Comment";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface IComment {
  _id: string;
  clientId_Zitadel: string;
  commentaire: string;
  createdAt: string;
  clientName?: string;
}

export default function CommentSlider() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const getComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/commentaires");
      setComments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEdit = async (id: string, newText: string) => {
    try {
      const response = await axios.put(
        `https://cesieat.nathan-lorit.com/api/commentaires/${id}`,
        {
          commentaire: newText,
        }
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === id
            ? { ...comment, commentaire: response.data.commentaire }
            : comment
        )
      );
    } catch (error) {
      console.log(error);
      alert("Une erreur est survenue lors de la mise à jour du commentaire.");
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = 320; // largeur d'une carte + gap
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (comments.length === 0) return;

    if (direction === "right") {
      const nextIndex = currentIndex + 1;
      
      // Si on arrive à la fin, revenir au début
      if (nextIndex >= comments.length) {
        scrollToIndex(0);
      } else {
        scrollToIndex(nextIndex);
      }
    } else {
      const prevIndex = currentIndex - 1;
      
      // Si on est au début, aller à la fin
      if (prevIndex < 0) {
        scrollToIndex(comments.length - 1);
      } else {
        scrollToIndex(prevIndex);
      }
    }
  };

  // Pour la navigation sur mobile, détection du swipe
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe à droite
    if (diff > 50) {
      handleScroll("right");
    }
    // Swipe à gauche
    else if (diff < -50) {
      handleScroll("left");
    }
  };

  // Indicateurs de pagination pour téléphone
  const renderPaginationDots = () => {
    if (comments.length <= 1) return null;
    
    return (
      <div className="flex justify-center gap-2 mt-4 sm:hidden">
        {comments.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Commentaire ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Flèche gauche (cachée sur mobile) */}
      <button
        onClick={() => handleScroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full z-10 p-2 hidden sm:block"
        aria-label="Commentaire précédent"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
      </button>

      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex gap-4 px-6 py-4 overflow-x-hidden scroll-smooth scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isLoading ? (
            <div className="text-center text-gray-500 w-full">
              Chargement des commentaires...
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="flex-shrink-0 w-[300px]">
                <Comment comment={comment} onEdit={onEdit} getComments={getComments} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full">
              Aucun commentaire pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* Flèche droite (cachée sur mobile) */}
      <button
        onClick={() => handleScroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full z-10 p-2 hidden sm:block"
        aria-label="Commentaire suivant"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-700" />
      </button>

      {/* Indicateurs de pagination pour mobile */}
      {renderPaginationDots()}
    </div>
  );
}
