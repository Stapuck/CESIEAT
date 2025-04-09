import IOSAppIcon from "../assets/IOS_store.svg";
import AndroidAppIcon from "../assets/Android_store.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-tertiary text-white py-4 px-4 sm:px-6">
      <div className="flex flex-col text-black max-w-7xl mx-auto">
        {/* Logo et téléchargements */}
        <div className="w-full mb-6">
          <div className="flex flex-col items-center sm:items-start">
            <div className="font-extrabold text-2xl mb-3">CHEF</div>
            <div className="flex flex-col sm:flex-row items-center">
              <img src={IOSAppIcon} alt="App Store" className="h-10 mb-2 sm:mb-0 sm:mr-3" />
              <img src={AndroidAppIcon} alt="Google Play" className="h-10 w-auto" />
            </div>
          </div>
        </div>
        
        {/* Réseaux sociaux et liens */}
        <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
          {/* Réseaux sociaux */}
          <div className="flex justify-center md:justify-start space-x-4">
            <img
              src="https://img.icons8.com/ios/50/000000/facebook-new.png"
              alt="Facebook"
              className="w-10 h-10"
            />
            <img
              src="https://img.icons8.com/ios/50/000000/twitter.png"
              alt="Twitter"
              className="w-10 h-10"
            />
            <img
              src="https://img.icons8.com/ios/50/000000/instagram-new.png"
              alt="Instagram"
              className="w-10 h-10"
            />
          </div>

          {/* Colonnes de liens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col space-y-2">
              <Link to="/livreur/faq" className="hover:underline">Question fréquente</Link>
              <Link to="/livreur/aboutus" className="hover:underline">A propos de nous</Link>
              <Link to="/livreur/contact" className="hover:underline">Nous contacter</Link>
            </div>

            <div className="flex flex-col space-y-2">
              <Link to="/livreur/promotion" className="hover:underline">Promotion</Link>
              <Link to="/livreur/tarif" className="hover:underline">Tarif</Link>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link to="/livreur/confidentialité" className="hover:underline">
                Politique de confidentialité
              </Link>
              <Link to="/livreur/terms" className="hover:underline">Condition d'utilisation</Link>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex justify-center md:justify-end mt-8 text-sm italic">
          <div>© 2025 C.H.E.F Technologies Inc.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
