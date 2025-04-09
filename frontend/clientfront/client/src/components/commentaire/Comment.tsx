import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import Swal from "sweetalert2"; // Ajout de l'import SweetAlert2
import { toast } from "react-toastify";

type CommentProps = {
  comment: {
    _id: string;
    clientId_Zitadel: string;
    commentaire: string;
    createdAt: string;
  };
  onEdit: (id: string, newText: string) => void;
  getComments: () => void;
};

interface IClient {
  name: String;
  email: String;
  phone: String;
  address: String;
  isPaused: Boolean;
  clientId_Zitadel: String;
}

export default function Comment({ comment, onEdit, getComments }: CommentProps) {
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentaire);
  const [commentaire, setCommentaire] = useState();
  const [client, setClient] = useState<IClient>();

  const currentUserId = auth.user?.profile.sub;
  console.log(commentaire);

  const isOwner = comment.clientId_Zitadel === currentUserId;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const getCommentsByIdClient = async (clientId_Zitadel: string) => {
    try {
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/commentaires/client/${clientId_Zitadel}`
      );
      setCommentaire(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClientByIdZitadel = async (clientId_Zitadel: string) => {
    try {
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/clients/byZitadelId/${clientId_Zitadel}`
      );
      setClient(response.data); // Stocke les infos du client (nom, prénom, etc.)
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
    }
  };

  useEffect(() => {
    if (comment.clientId_Zitadel) {
      getClientByIdZitadel(comment.clientId_Zitadel);
    }
  }, [comment.clientId_Zitadel]);

  useEffect(() => {
    if (currentUserId) {
      getCommentsByIdClient(currentUserId);
    }
  }, [currentUserId]);

  const handleDelete = async (idcomment: string) => {
    const result = await Swal.fire({
      title: "Voulez vous vraiment supprimer votre commentaire ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`https://cesieat.nathan-lorit.com/api/commentaires/${idcomment}`);
        toast.success("Votre commentaire a été supprimé");
        getClientByIdZitadel(comment.clientId_Zitadel);
        getComments();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-w-[280px] max-w-sm bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between">
      <div className="text-xs text-gray-400">{formattedDate}</div>

      <div className="font-semibold text-gray-800">
        {client?.name ?? "Utilisateur"}{" "}
      </div>

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
        <p className="mt-2 text-gray-700 whitespace-pre-line">
          {comment.commentaire}
        </p>
      )}

      {isOwner && !isEditing && (
        <div className="flex justify-between">
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 text-blue-500 text-sm self-end hover:underline"
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(comment._id)}
            className="mt-3 text-red-500 text-sm self-end hover:underline"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
