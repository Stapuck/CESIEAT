import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { useLogger } from "../hooks/useLogger";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const auth = useAuth();
  const logger = useLogger();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: "1.0.0",
    category: "",
    tags: "",
    documentation: "",
    author: auth.user?.profile?.name || "Inconnu",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Créer un objet FormData pour envoyer des fichiers
      const componentData = new FormData();

      // Ajouter les données du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        componentData.append(key, value);
      });

      // Ajouter le fichier si présent
      if (file) {
        componentData.append("componentFile", file);
      }

      // URL correcte du backend - conserver HTTPS car c'est l'URL exposée via nginx
      await axios.post("https://cesieat.nathan-lorit.com/api/components", componentData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Composant créé avec succès!");

      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate("/technical/");
      }, 2000);
    } catch (err: any) {
      logger({
        type: "error",
        message: "Erreur lors de la création du composant: " + err.message,
        clientId_Zitadel: "system"
      });
      
      // Afficher un message d'erreur plus détaillé si disponible
      setError(
        err.response?.data?.error || 
        "Une erreur est survenue lors de la création du composant."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Créer un nouveau composant</h1>
        <p className="text-gray-600">
          Remplissez le formulaire pour ajouter un nouveau composant à la
          plateforme
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p>{success}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom du composant */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom du composant *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Version */}
          <div>
            <label
              htmlFor="version"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Version *
            </label>
            <input
              type="text"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
              pattern="^\d+\.\d+\.\d+$"
              placeholder="1.0.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: x.y.z (ex: 1.0.0)
            </p>
          </div>

          {/* Catégorie */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Base de données</option>
              <option value="security">Sécurité</option>
              <option value="testing">Tests</option>
              <option value="utility">Utilitaire</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="javascript, react, ui (séparés par des virgules)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Fichier du composant */}
          <div className="md:col-span-2">
            <label
              htmlFor="componentFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fichier du composant *
            </label>
            <input
              type="file"
              id="componentFile"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              ZIP, JAR, NPM ou autres formats acceptés
            </p>
          </div>

          {/* Documentation */}
          <div className="md:col-span-2">
            <label
              htmlFor="documentation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Documentation / Instructions d'installation
            </label>
            <textarea
              id="documentation"
              name="documentation"
              value={formData.documentation}
              onChange={handleChange}
              rows={6}
              placeholder="Ajoutez ici les instructions d'installation, la documentation ou toute autre information utile pour les utilisateurs."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Le format Markdown est supporté
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/technical/")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Création en cours..." : "Créer le composant"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
