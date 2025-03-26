import { Link } from "react-router-dom";
import GalleryProduct from "../components/GalleryProduct";


const HomePage = () => {

  return (
    <div>
      <h1>
        this is HomePage
      </h1>
      <div>
      <Link to='/create-product' className='inline-block mx-2 mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-500 hover:cursor-pointer'> Create a product</Link>

      </div>

      <div>
        <GalleryProduct/>
      </div>
    </div>
  )
}

export default HomePage