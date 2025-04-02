import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    version: "1.0.0",
    category: "",
    language: "",
    tags: "",
    price: "0",
    license: "MIT"
  });
  
  const [files, setFiles] = useState<FileList | null>(null);
  const [documentation, setDocumentation] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleDocumentationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentation(e.target.value);
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un envoi de données à l'API (à remplacer par un vrai appel API)
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirection vers une page de confirmation ou de détail du produit
      navigate("/developer/product/new");
    }, 1500);
  };

  // Rendu du formulaire étape par étape
  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Informations de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du composant *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description courte *
                </label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength={120}
                  placeholder="Une brève description (max 120 caractères)"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription.length}/120 caractères
                </p>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description complète *
                </label>
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="authentication">Authentification</option>
                  <option value="payment">Paiement</option>
                  <option value="analytics">Analytique</option>
                  <option value="ui">Interface utilisateur</option>
                  <option value="api">API / Intégration</option>
                  <option value="security">Sécurité</option>
                  <option value="database">Base de données</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Langage principal *
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                >
                  <option value="">Sélectionner un langage</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Séparés par des virgules"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-700 text-white rounded-md px-6 py-2 font-medium hover:bg-blue-500 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Fichiers et documentation</h2>
            
            <div className="mb-6">
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
                Fichiers du composant *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  id="files"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  required
                />
                <label htmlFor="files" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium text-blue-600 hover:underline">Cliquez pour télécharger</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500 mt-1">ZIP, TAR.GZ (max 100MB)</p>
                  </div>
                </label>
                {files && files.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    {Array.from(files).map((file, index) => (
                      <p key={index}>{file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="documentation" className="block text-sm font-medium text-gray-700 mb-1">
                Documentation (Markdown supporté) *
              </label>
              <textarea
                id="documentation"
                value={documentation}
                onChange={handleDocumentationChange}
                rows={12}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border font-mono"
                placeholder="# Guide d'utilisation du composant&#10;&#10;## Installation&#10;&#10;```bash&#10;npm install mon-composant&#10;```&#10;&#10;## Exemple d'utilisation&#10;&#10;```javascript&#10;import { Component } from 'mon-composant';&#10;&#10;// Votre code ici&#10;```"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                La documentation aide les utilisateurs à comprendre comment installer et utiliser votre composant.
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 rounded-md px-6 py-2 font-medium hover:bg-gray-300 transition-colors"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-700 text-white rounded-md px-6 py-2 font-medium hover:bg-blue-500 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Licence et publication</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de licence *
                </label>
                <select
                  id="license"
                  name="license"
                  value={formData.license}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                >
                  <option value="MIT">MIT</option>
                  <option value="Apache2">Apache 2.0</option>
                  <option value="GPL3">GPL 3.0</option>
                  <option value="BSD">BSD</option>
                  <option value="proprietary">Propriétaire / Commercial</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Laissez 0 pour un composant gratuit
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    En publiant ce composant, vous acceptez les <a href="#" className="font-medium underline">conditions d'utilisation</a> et vous certifiez avoir les droits nécessaires sur le code soumis.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 rounded-md px-6 py-2 font-medium hover:bg-gray-300 transition-colors"
              >
                Précédent
              </button>
              <button
                type="submit"
                className={`bg-green-600 text-white rounded-md px-6 py-2 font-medium hover:bg-green-500 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publication en cours...' : 'Publier le composant'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Créer un nouveau composant</h1>
        <p className="text-gray-600">Partagez votre code avec la communauté des développeurs</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Indicateur d'étape */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="w-full flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <div className="w-8 text-center">Informations</div>
            <div className="w-8 text-center ml-auto mr-auto">Fichiers</div>
            <div className="w-8 text-center">Publication</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderFormStep()}
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
