import { Link } from "react-router-dom";
import GalleryProduct from "../components/GalleryProduct";
// import GalleryArticle from "../components/GalleryArticle";


const HomePage = () => {

  return (
    <div>
      <h1>
        this is HomePage
      </h1>

      <div>
      <Link to='/create-article' className='inline-block mx-2 mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-500 hover:cursor-pointer'> Create a new article</Link>
      <Link to='/create-menu' className='inline-block mx-2 mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-500 hover:cursor-pointer'> Create a new menu</Link>

      </div>





      <div>
      <Link to='/create-product' className='inline-block mx-2 mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-500 hover:cursor-pointer'> Create a product</Link>

      </div>

      <div>
        <GalleryProduct/>
        {/* <GalleryArticle/> */}
        


      </div>

      {/* <div className='grid grid-cols-2 lg:grid-cols-4 mt-5'>
            {isLoading ? ("Loading") : (
                <>
                    {articles.length > 0 ? (
                        articles.map((article, index) => (
                            <Article key={index} article={article} getArticles={getArticles} />
                        ))
                    ) : (
                        <div>Aucun article disponible</div>
                    )}
                </>
            )}
        </div>*/}
    </div> 
  )
}

export default HomePage