import BackgroundFood from "../assets/background_food.jpg";
import SearchIcon from "../assets/search.svg";
import Quote from "../assets/quote.svg";
import InversedQuote from "../assets/quote_inversed.svg";
import React, { useState, useEffect } from "react";


const Hero = () => {
    const messages = [
        "Plus rapide qu’un micro-ondes, meilleur qu’un resto !",
        "Commandez vos plats préférés en un clic !",
        "Livraison rapide et délicieuse à votre porte !",
    ];

    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prevMessage) => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);
    return (
        <div
            className="flex flex-col justify-center hero-content relative items-center z-0 bg-cover bg-center  mt-20  bg-no-repeat"
            style={{ backgroundImage: `url(${BackgroundFood})` }}
        >
            <div className="relative w-250 items-center mb-6 z-10 mt-10 rounded-3xl shadow-2xl bg-transparent-background p-8">
                <h1 className="text-5xl font-extrabold p-8">
                    Bienvenue sur{" "}
                    <span className="bg-gradient-to-r from-gradient-left to-gradient-right bg-clip-text font-extrabold text-transparent">
                        C.H.E.F.
                    </span>
                </h1>
                <img
                    src={Quote}
                    alt="Quote"
                    className="p-4 max-w-sm object-contain z-10"
                />
                <p className="text-center font-bold italic">{currentMessage}</p>

                <div className="flex justify-end items-end">
                    <img
                        src={InversedQuote}
                        alt="Inversed Quote"
                        className="p-4 max-w-sm object-contain z-10"
                    />
                </div>
            </div>
            <div className="flex justify-around py-8 items-center w-full  relative z-10 bg-primary">
                <div>
                    <p className="text-white font-bold pl-5 pb-4">
                        Rapide et proche de chez vous
                    </p>
                    <div className="relative w-full  max-w-300">
                        <input
                            type="text"
                            className="input shadow-xl input-bordered text-text-search-color placeholder-text-search-color bg-white rounded-full font-bold p-3 max-w-full pr-12"
                            placeholder="Votre ville"
                        />
                        <button className="absolute shadow-2xl  top-1/2 right-3 transform -translate-y-1/2 bg-button-background p-2 rounded-full">
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;