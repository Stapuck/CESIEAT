import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

type CommentProps = {
  comment: {
    _id: string;
    clientId_Zitadel: string;
    commentaire: string;
    createdAt: string;
  };
  onEdit: (id: string, newText: string) => void;
};

export default function Comment({ comment, onEdit }: CommentProps) {
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentaire);
  const [commentaire, setCommentaire] = useState();

  const currentUserId = auth.user?.profile.sub

  const isOwner = comment.clientId_Zitadel === currentUserId;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const getCommentsByIdClient = async (clientId_Zitadel: string) => {
    try {
        const response = await axios.get(`https://localhost/api/commentaires/client/${clientId_Zitadel}`);
        setCommentaire(response.data);
    } catch (error) {
        console.log(error);
    }
};


  useEffect(() => {
    if (currentUserId) {
        getCommentsByIdClient(currentUserId); // Assure-toi que `currentUserId` est bien défini
    }
}, [currentUserId]);  // Si `currentUserId` change, on recharge les commentaires


  return (
    <div className="min-w-[280px] max-w-sm bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between">
      <div className="text-xs text-gray-400">{formattedDate}</div>
      <div className="font-semibold text-gray-800">{comment.clientId_Zitadel ?? 'Utilisateur'}</div>

      {isEditing ? (
        <>
          <textarea
            className="mt-2 p-2 border border-gray-300 rounded resize-none"
            rows={3}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => {
                setIsEditing(false);
                setEditedText(comment.commentaire);
              }}
            >
              Annuler
            </button>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                onEdit(comment._id, editedText);
                setIsEditing(false);
              }}
            >
              Sauvegarder
            </button>
          </div>
        </>
      ) : (
        <p className="mt-2 text-gray-700 whitespace-pre-line">{comment.commentaire}</p>
      )}

      {isOwner && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-3 text-blue-500 text-sm self-end hover:underline"
        >
          Modifier
        </button>
      )}
    </div>
  );
}
