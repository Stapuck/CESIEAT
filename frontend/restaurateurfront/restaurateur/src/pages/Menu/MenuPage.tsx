import { Link } from "react-router-dom"
import GalleryMenu from "../../components/GalleryMenu"

const MenuPage = () => {
  return (
    <div>
      <h1>
        this is MenuPage
      </h1>
      <div>
      <Link to='/restaurateur/create-menu' className='inline-block mx-2 mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-500 hover:cursor-pointer'> Create a new menu</Link>
      </div>

      <GalleryMenu/>

      
    </div> 
  )
}

export default MenuPage