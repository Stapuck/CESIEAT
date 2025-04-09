// import Comment from "./Comment";
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// interface IComment {
//   _id: string;
//   clientId_Zitadel: string;
//   commentaire: string;
//   createdAt: string;
//   clientName?: string;
// }

// export default function CommentSlider() {
//   const [comments, setComments] = useState<IComment[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const sliderRef = useRef<HTMLDivElement>(null);
  
//   const getComments = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("https://localhost/api/commentaires");
//       setComments(response.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onEdit = async (id: string, newText: string) => {
//     try {
//       const response = await axios.put(
//         `https://localhost/api/commentaires/${id}`,
//         {
//           commentaire: newText,
//         }
//       );

//       setComments((prevComments) =>
//         prevComments.map((comment) =>
//           comment._id === id
//             ? { ...comment, commentaire: response.data.commentaire }
//             : comment
//         )
//       );
//     } catch (error) {
//       console.log(error);
//       alert("Une erreur est survenue lors de la mise à jour du commentaire.");
//     }
//   };

//   useEffect(() => {
//     getComments();
//   }, []);

//   // const scroll = (direction: "left" | "right") => {
//   //   if (sliderRef.current) {
//   //     const scrollAmount = 320; // correspond à la largeur d'une carte + gap
//   //     sliderRef.current.scrollBy({
//   //       left: direction === "left" ? -scrollAmount : scrollAmount,
//   //       behavior: "smooth",
//   //     });
//   //   }
//   // };

//   const loopComments = (direction: "left" | "right") => {
//     if (sliderRef.current) {
//       const scrollAmount = 320; // correspond à la largeur d'une carte + gap

//       // Scrolls right
//       if (direction === "right") {
//         const lastComment = comments[comments.length - 1];
//         setComments((prevComments) => [...prevComments, lastComment]);
//       }
      
//       // Scrolls left
//       if (direction === "left") {
//         const firstComment = comments[0];
//         setComments((prevComments) => [firstComment, ...prevComments]);
//       }
      
//       sliderRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="relative w-full max-w-3xl mx-auto">
//       {/* Flèche gauche */}
//       <button
//         onClick={() => loopComments("left")}
//         className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full z-10 p-2"
//       >
//         <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
//       </button>

//       {/* Contenu scrollable */}
//       <div className="overflow-hidden">
//         <div
//           ref={sliderRef}
//           className="flex gap-4 px-6 py-4 overflow-x-hidden scroll-smooth scrollbar-hide"
//           style={{ scrollBehavior: "smooth" }}
//         >
//           {isLoading ? (
//             <div className="text-center text-gray-500">
//               Chargement des commentaires...
//             </div>
//           ) : (
//             comments.map((comment) => (
//               <div key={comment._id} className="flex-shrink-0 w-[300px]">
//                 <Comment comment={comment} onEdit={onEdit} getComments={getComments} />
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Flèche droite */}
//       <button
//         onClick={() => loopComments("right")}
//         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full z-10 p-2"
//       >
//         <ChevronRightIcon className="h-5 w-5 text-gray-700" />
//       </button>
//     </div>
//   );
// }

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

  const loopComments = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 320; // correspond à la largeur d'une carte + gap

      // Scrolls right
      if (direction === "right") {
        const lastComment = comments[comments.length - 1];
        setComments((prevComments) => [...prevComments, lastComment]);
      }
      
      // Scrolls left
      if (direction === "left") {
        const firstComment = comments[0];
        setComments((prevComments) => [firstComment, ...prevComments]);
      }
      
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto"> 
      <button
        onClick={() => loopComments("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full z-10 p-2"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
      </button>

      <div className="overflow-hidden">
        <div
          ref={sliderRef}
          className="flex gap-4 px-6 py-4 overflow-x-hidden scroll-smooth scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {isLoading ? (
            <div className="text-center text-gray-500">
              Chargement des commentaires...
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex-shrink-0 w-[300px]">
                <Comment comment={comment} onEdit={onEdit} getComments={getComments} />
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => loopComments("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full z-10 p-2"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
}
