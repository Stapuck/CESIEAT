import BackgroundGrandient from "../assets/background_gradient.svg";
import OrderFoodIllustration from "../assets/order_food.svg";
import SearchIcon from "../assets/search.svg";
import Quote from "../assets/quote.svg";
import InversedQuote from "../assets/quote_inversed.svg";

const Hero = () => {
    return (
        <div className=" flex flex-col justify-center hero-content items-center mb-20 relative">
            <div className="relative max-w-md items-center w-full mb-6 z-10">
                <h1 className="text-5xl font-extrabold p-8">
                    Bienvenue sur <span className="bg-gradient-to-r from-gradient-left to-gradient-right bg-clip-text font-extrabold text-transparent">C.H.E.F. </span>
                </h1>
                <img
                    src={Quote}
                    alt="Order Food"
                    className=" p-4 max-w-sm object-contain z-10"
                />
                <p className="text-center">
                    Plus rapide qu’un micro-ondes, meilleur qu’un resto !
                </p>
                <div className="flex justify-end items-end">
                    <img
                        src={InversedQuote}
                        alt="Order Food"
                        className="  p-4 max-w-sm object-contain z-10"
                    />
                </div >


            </div>
            <div className="flex justify-around pt-8 items-center w-full relative z-10">
                <img
                    src={OrderFoodIllustration}
                    alt="Order Food"
                    className=" max-w-400 object-contain z-10"
                />

                <div>
                    <p className="text-white font-bold pl-5 pb-4">
                        Rapide et proche de chez vous
                    </p>
                    <div className="relative w-full max-w-300">
                        <input
                            type="text"
                            className="input input-bordered text-text-search-color placeholder-text-search-color bg-white rounded-full font-bold p-3 max-w-full pr-12"
                            placeholder="Votre ville"
                        />
                        <button className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-button-background p-2 rounded-full">
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>

            </div>

            {/* Image de fond avec le dégradé */}
            <img
                src={BackgroundGrandient}
                alt="Background Gradient"
                className=" absolute mt-50 top-0 left-0 w-full object-cover z-0"
            />
        </div>
    );
};

export default Hero;