const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col mt-35">
      <div className="p-8 max-w-3xl mx-auto rounded-md bg-white">
        <h1 className="text-3xl font-bold mb-4">Obtenir de l'aide</h1>
        <p className="mb-6">
          Vous avez une question, un problème ou une suggestion ? N'hésitez pas
          à nous contacter via le formulaire ci-dessous.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Votre message"
            className="w-full border p-2 rounded h-32"
          ></textarea>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};
export default ContactPage;
