import BackgroundFood from "../assets/background_food.jpg";
import SearchIcon from "../assets/icons/magnifyingglass.svg";
import Quote from "../assets/quote.svg";
import InversedQuote from "../assets/quote_inversed.svg";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";


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
            className="flex flex-col justify-center hero-content relative items-center z-0 bg-cover bg-center h-full w-full overflow-clip mt-20 bg-no-repeat"
            style={{ backgroundImage: `url(${BackgroundFood})` }}
        >
            <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                }}
                className="relative items-center mx-2 mb-6 z-10 mt-10 rounded-3xl shadow-2xl bg-transparent-background p-8 sm:w-screen]">
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
            </motion.div>
            
        </div>
    );
};

export default Hero;