import { Link } from "react-router-dom";
import GalleryProduct from "../components/GalleryProduct";
import Hero from "../components/Hero";


const HomePage = () => {

  return (
    <div className=" z-10">
      <Hero/>

      <div>
        <GalleryProduct/>
      </div>
    </div>
  )
}

export default HomePage