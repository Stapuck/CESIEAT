import GalleryRestaurants from "../components/restaurantsComponents/GalleryRestaurants";
import Hero from "../components/Hero";


const HomePage = () => {


  return (
    <div className="z-10">
      <Hero />
      <div>
        <GalleryRestaurants login={true} />
      </div>
    </div>
  );
};

export default HomePage;