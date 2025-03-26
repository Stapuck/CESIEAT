import BackgroundGrandient from "../assets/background_gradient.svg";
import OrderFoodIllustration from "../assets/order_food.svg";

const Hero = () => {
    return (
        <div className=" flex flex-col justify-between hero-content items-center ">
            <div className="relative max-w-md items-center z-10">
                <h1 className="text-5xl font-bold p-8">
                    Bienvenue sur <span className="bg-gradient-to-r from-gradient-left to-gradient-right bg-clip-text font-bold text-transparent">C.H.E.F. </span>
                </h1>

                <p>
                    C.H.E.F. est une application de commande de repas en ligne qui vous permet de commander des plats délicieux et variés auprès de vos restaurants préférés. Que vous soyez à la maison, au bureau ou en déplacement, C.H.E.F. vous offre une expérience de commande simple et rapide.
                </p>


            </div>
            <div className="flex justify-between items-center relative z-10">
                <img
                    src={OrderFoodIllustration}
                    alt="Order Food"
                    className="  w-1/2 max-w-sm object-contain z-10"
                />

            </div>

            {/* Image de fond avec le dégradé */}
            <img
                src={BackgroundGrandient}
                alt="Background Gradient"
                className=" absolute pt-[450px] top-0 left-0 w-full h-full object-cover z-0"
            />
        </div>
    );
};

export default Hero;