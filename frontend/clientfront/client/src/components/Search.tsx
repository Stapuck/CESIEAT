import React, { useState, useRef } from "react";
import SearchIcon from "../assets/icons/magnifyingglass.svg";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import FoodIcon from "../assets/icons/fork.knife.circle.fill.svg";
import LocationPin from "../assets/icons/mappin.svg";
import LoadingArrow from "../assets/icons/arrow.trianglehead.2.clockwise.svg";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";

const customIcon = new L.Icon({
    iconUrl: FoodIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const locationIcon = new L.Icon({
    iconUrl: LocationPin,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const predefinedPoints = [
    { "id": 1, "name": "La Tour d'Argent", "position": [48.8498, 2.3549], "ville": "Paris" },
    { "id": 2, "name": "Michel Sarran", "position": [43.6047, 1.4442], "ville": "Toulouse" },
    { "id": 3, "name": "Paul Bocuse", "position": [45.7790, 4.8497], "ville": "Lyon" },
    { "id": 4, "name": "Au Crocodile", "position": [48.5839, 7.7465], "ville": "Strasbourg" },
    { "id": 5, "name": "La Table", "position": [50.6372, 3.0635], "ville": "Lille" },
    { "id": 6, "name": "L'Atlantide 1874", "position": [47.2060, -1.5747], "ville": "Nantes" },
    { "id": 7, "name": "Le Petit Nice", "position": [43.2801, 5.3518], "ville": "Marseille" },
    { "id": 8, "name": "Le Pressoir d'Argent", "position": [44.8410, -0.5737], "ville": "Bordeaux" },
    { "id": 9, "name": "Le Jardin des Sens", "position": [43.6110, 3.8767], "ville": "Montpellier" },
    { "id": 10, "name": "Le 1920", "position": [45.8547, 6.6240], "ville": "Megève" },
    { "id": 11, "name": "La Marine", "position": [46.9890, -2.2631], "ville": "Noirmoutier" },
    { "id": 12, "name": "L'Oustau de Baumanière", "position": [43.7440, 4.7950], "ville": "Les Baux-de-Provence" },
    { "id": 13, "name": "La Côte Saint-Jacques", "position": [47.8890, 3.5120], "ville": "Joigny" },
    { "id": 14, "name": "Le Pavillon", "position": [48.6937, 6.1834], "ville": "Nancy" },
    { "id": 15, "name": "Le Relais Bernard Loiseau", "position": [47.2775, 4.3581], "ville": "Saulieu" },
    { "id": 16, "name": "La Maison Troisgros", "position": [46.0408, 4.0737], "ville": "Ouches" },
    { "id": 17, "name": "L'Auberge du Vieux Puits", "position": [42.9908, 2.7464], "ville": "Fontjoncouse" },
    { "id": 18, "name": "Le Pré Catelan", "position": [48.8630, 2.2530], "ville": "Paris (Bois de Boulogne)" },
    { "id": 19, "name": "La Chèvre d'Or", "position": [43.7269, 7.3616], "ville": "Èze" },
    { "id": 20, "name": "L'Oiseau Blanc", "position": [48.8743, 2.3006], "ville": "Paris" },
    { "id": 21, "name": "L'Auberge du Pont de Collonges", "position": [45.7790, 4.8497], "ville": "Collonges-au-Mont-d'Or" },
    { "id": 22, "name": "Le Gabriel", "position": [44.8410, -0.5737], "ville": "Bordeaux" },
    { "id": 23, "name": "Le Gavroche", "position": [49.2600, 4.0340], "ville": "Reims" },
    { "id": 24, "name": "Le Clos des Sens", "position": [45.9160, 6.1400], "ville": "Annecy" },
    { "id": 25, "name": "La Pyramide", "position": [45.5200, 4.8720], "ville": "Vienne" },
    { "id": 26, "name": "Château de Mercuès", "position": [44.5400, 1.3870], "ville": "Mercuès" },
    { "id": 27, "name": "Les Prés d'Eugénie", "position": [43.7036, -0.3844], "ville": "Eugénie-les-Bains" },
    { "id": 28, "name": "La Table de Pavie", "position": [44.8910, -0.1550], "ville": "Saint-Émilion" },
    { "id": 29, "name": "Auberge de l'Ill", "position": [48.1456, 7.3378], "ville": "Illhaeusern" },
    { "id": 30, "name": "La Grenouillère", "position": [50.5120, 1.6615], "ville": "Montreuil-sur-Mer" },
    { "id": 31, "name": "Maison Pic", "position": [44.9240, 4.9053], "ville": "Valence" },
    { "id": 32, "name": "Christopher Coutanceau", "position": [46.1570, -1.1690], "ville": "La Rochelle" },
    { "id": 33, "name": "Le Coquillage", "position": [48.6452, -1.8601], "ville": "Saint-Méloir-des-Ondes" },
    { "id": 34, "name": "Le Bec au Cauchois", "position": [49.6990, 0.6360], "ville": "Valmont" },
    { "id": 35, "name": "Le Prince Noir", "position": [44.8370, -0.5740], "ville": "Lormont" },
    { "id": 36, "name": "Hostellerie Jérôme", "position": [43.7270, 7.3630], "ville": "La Turbie" },
    { "id": 37, "name": "Kei", "position": [48.8646, 2.3423], "ville": "Paris" },
    { "id": 38, "name": "L'Écrin", "position": [48.8652, 2.3264], "ville": "Paris" },
    { "id": 39, "name": "Assiette Champenoise", "position": [49.2540, 4.0240], "ville": "Tinqueux" },
    { "id": 40, "name": "Le Chambard", "position": [48.1420, 7.2990], "ville": "Kaysersberg" },
    { "id": 41, "name": "Le Domaine de Clairefontaine", "position": [45.4820, 4.8140], "ville": "Chonas-l'Amballan" },
    { "id": 42, "name": "Le Relais de la Poste", "position": [43.4690, -1.5300], "ville": "Magescq" },
    { "id": 43, "name": "La Bouitte", "position": [45.4400, 6.5100], "ville": "Saint-Martin-de-Belleville" },



];

const Search = () => {
    const [position, setPosition] = useState<[number, number]>([46.603354, 1.888334]);
    const searchQueryRef = useRef("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<{ id: number; name: string; position: [number, number]; ville: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(5);

    const handleSearch = async () => {
        const query = searchQueryRef.current.trim();
        if (!query) return;
        setLoading(true);
        setZoom(13);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                setPosition([parseFloat(lat), parseFloat(lon)]);
            } else {
                toast.error("Aucun résultat trouvé pour cette ville.");
            }
        } catch (error) {
            toast.error("Erreur lors de la recherche.");
        } finally {
            setLoading(false);
        }
    };

    const RecenterMap = ({ position }: { position: [number, number] }) => {
        const map = useMap();
        map.setView(position, zoom);
        return null;
    };

    const handleInputChange = (e: { target: { value: string; }; }) => {
        searchQueryRef.current = e.target.value.trim();
        const query = searchQueryRef.current.toLowerCase();
        if (query) {
            const suggestions = predefinedPoints.filter((point) =>
                point.name.toLowerCase().includes(query) || point.ville.toLowerCase().includes(query)
            );
            setFilteredSuggestions(
                suggestions.map((point) => ({
                    ...point,
                    position: [point.position[0], point.position[1]] as [number, number],
                }))
            );
            setShowSuggestions(suggestions.length > 0);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (point: { id?: number; name: any; position: any; ville?: string; }) => {
        searchQueryRef.current = point.name;
        setPosition(point.position);
        setZoom(13);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col items-center relative z-10 bg-primary py-8">
            <p className="text-white font-bold text-center pb-4">Rapide et proche de chez vous</p>
            <div className="relative w-[270px] sm:w-[370px] md:w-[470px] lg:w-[570px] xl:w-[670px]">
                <input
                    type="text"
                    onChange={handleInputChange}
                    className="input shadow-xl input-bordered text-text-search-color bg-white rounded-full font-bold p-3 w-full"
                    placeholder="Votre ville ou restaurant"
                    aria-label="Champ de recherche"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
                <button
                    onClick={handleSearch}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-button-background p-2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-200"
                    aria-label="Rechercher"
                >
                    {loading ? <img src={LoadingArrow} className="w-5 h-5"/> : <img src={SearchIcon} alt="Search" className="w-5 h-5" />}
                </button>
                {showSuggestions && (
                    <ul className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full max-h-40 overflow-y-auto z-50">
                        {filteredSuggestions.map((point) => (
                            <li
                                key={point.id}
                                onClick={() => handleSuggestionClick(point)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {point.name} - {point.ville}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="w-full h-[400px] mt-8 px-3 z-1 max-w-350">
                <MapContainer
                    center={position}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    markerZoomAnimation={true}
                    bounceAtZoomLimits={true}
                    
                    className="h-full w-full rounded-lg shadow-lg"
                    
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <RecenterMap position={position} />

                    {/* Marqueur pour la position actuelle */}
                    <Marker position={position} icon={locationIcon}>
                        <Popup>Position actuelle : {searchQueryRef.current}</Popup>
                    </Marker>

                    {/* Marqueurs pour tous les restaurants */}
                    {predefinedPoints.map((point) => (
                        <Marker key={point.id} position={point.position as [number, number]} icon={customIcon}>
                            <Popup>
                                <strong>{point.name}</strong>
                                <br />
                                {point.ville}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default Search;
