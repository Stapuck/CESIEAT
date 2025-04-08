import Comment from './Comment';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface IComment {
  _id: string;
  clientId_Zitadel: string;
  commentaire: string;
  createdAt: string;
  clientName?: string;
}

export default function CommentSlider() {

  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Pour gérer le chargement


  const getComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://cesieat.nathan-lorit.com/api/commentaires');
      setComments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEdit = async (id: string, newText: string) => {
    try {
      const response = await axios.put(`https://cesieat.nathan-lorit.com/api/commentaires/${id}`, {
        commentaire: newText,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === id ? { ...comment, commentaire: response.data.commentaire } : comment
        )
      );
    } catch (error) {
      console.log(error);
      alert('Une erreur est survenue lors de la mise à jour du commentaire.');
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="overflow-x-auto flex gap-4 py-4 px-1">
      <div className="flex gap-4" style={{ minWidth: '100%' }}>
        {isLoading ? (
          <div className="text-center text-gray-500">Chargement des commentaires...</div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
