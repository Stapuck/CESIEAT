import GalleryRestaurants from "../components/restaurantsComponents/GalleryRestaurants";
import Hero from "../components/Hero";


const HomePageWithoutLogin = () => {

  return (
    <div className=" z-10">
      <Hero/>

      <div>
        <GalleryRestaurants login={false} />
      </div>
    </div>
  )
}

export default HomePageWithoutLogin