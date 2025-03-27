import SearchIcon from "../assets/icons/magnifyingglass.svg";
const Search = () => {
    return (
        <div className="flex justify-around py-8 items-center   relative z-10 bg-primary">
            <div>
                <p className="text-white font-bold pl-5 pb-4">
                    Rapide et proche de chez vous
                </p>
                <div className="relative w-[5000px]  ">
                    <input
                        type="text"
                        className="input shadow-xl input-bordered text-text-search-color placeholder-text-search-color bg-white rounded-full font-bold p-3  pr-12"
                        placeholder="Votre ville"
                    />
                    <button className="absolute shadow-2xl  top-1/2 right-3 transform -translate-y-1/2 -translate-x-1/6 bg-button-background p-2 rounded-full">
                        <img
                            src={SearchIcon}
                            alt="Search"
                            className="w-5 h-5 shadow-2xl"
                        />
                    </button>
                </div>
            </div>
        </div>
    );

}
export default Search;