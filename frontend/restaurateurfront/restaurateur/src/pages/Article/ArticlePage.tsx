import { Link } from "react-router-dom";
import TableauArticle from "../../components/TableauArticle";

const ArticlePage = () => {
  return (
    <div className="mt-25 px-3">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des Articles</h1>
      <div>
        <Link
          to="/restaurateur/create-article"
          className="inline-block mx-2 mt-4 shadow-md bg-tertiary text-white hover:bg-white hover:text-tertiary rounded-sm px-4 py-2 font-bold  hover:cursor-pointer transform hover:scale-105 transition duration-200"
        >
          {" "}
          Créer un article
        </Link>
      </div>

      <TableauArticle />
    </div>
  );
};

export default ArticlePage;
