import { Link } from "react-router-dom"
import TableauArticle from "../../components/TableauArticle"

const ArticlePage = () => {

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Articles
        </h1>
      <div>
      <Link to='/restaurateur/create-article' className='inline-block mx-2 mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-500 hover:cursor-pointer'> Create a new article</Link>
      </div>

      <TableauArticle/>
      
    </div> 
  )
}

export default ArticlePage