import GalleryRestaurants from "../components/restaurantsComponents/GalleryRestaurants";
import Hero from "../components/Hero";
import CommentSlider from "../components/commentaire/CommentSlider";

const HomePage = () => {
  return (
    <div className="z-10">
      <Hero />
      <div>
        <GalleryRestaurants login={true} />
      </div>

      <div>
        <CommentSlider/>
      </div>
    </div>
  );
};

export default HomePage;
