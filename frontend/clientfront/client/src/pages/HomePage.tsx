import GalleryRestaurants from "../components/restaurantsComponents/GalleryRestaurants";
import Hero from "../components/Hero";

const HomePage = () => {
  return (
    <div className="z-10">
      <Hero />
      
      <div className="bg-red-500">
        <GalleryRestaurants login={true} />
      </div>

      
    </div>
  );
};

export default HomePage;
