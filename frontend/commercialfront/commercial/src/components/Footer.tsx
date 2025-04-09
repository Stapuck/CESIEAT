import IOSAppIcon from "../assets/IOS_store.svg";
import AndroidAppIcon from "../assets/Android_store.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-tertiary text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col text-black">
          {/* Première section: Logo et badges d'app stores */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-6">
            <div className="flex flex-col items-center sm:items-start justify-between p-2 mb-4 sm:mb-0">
              <div className="font-extrabold text-2xl mb-3">CHEF</div>
              <div className="flex flex-col sm:flex-row items-center">
                <img src={IOSAppIcon} alt="App Store" className="h-10 mb-2 sm:mb-0 sm:mr-3" />
                <img src={AndroidAppIcon} alt="Google Play" className="h-10 w-auto" />
              </div>
            </div>
          </div>
          
          {/* Deuxième section: Réseaux sociaux et liens */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mt-2 border-t border-gray-200 pt-4">
            {/* Réseaux sociaux */}
            <div className="flex justify-center mb-6 sm:mb-0">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img
                  src="https://img.icons8.com/ios/50/000000/facebook-new.png"
                  alt="Facebook"
                  className="w-8 h-8"
                />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img
                  src="https://img.icons8.com/ios/50/000000/twitter.png"
                  alt="Twitter"
                  className="w-8 h-8"
                />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img
                  src="https://img.icons8.com/ios/50/000000/instagram-new.png"
                  alt="Instagram"
                  className="w-8 h-8"
                />
              </a>
            </div>

            {/* Groupes de liens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full sm:w-auto">
              <div className="flex flex-col items-center sm:items-start">
                <Link to="/commercial/faq" className="mb-1 hover:underline">Questions fréquentes</Link>
                <Link to="/commercial/aboutus" className="mb-1 hover:underline">À propos de nous</Link>
                <Link to="/commercial/contact" className="hover:underline">Nous contacter</Link>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Link to="/commercial/promotion" className="mb-1 hover:underline">Promotion</Link>
                <Link to="/commercial/tarif" className="hover:underline">Tarif</Link>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Link to="/commercial/confidentialité" className="mb-1 hover:underline">Politique de confidentialité</Link>
                <Link to="/commercial/terms" className="hover:underline">Conditions d'utilisation</Link>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="flex justify-center sm:justify-end italic mt-6 pt-4 border-t border-gray-200 text-sm">
            <div>© 2025 C.H.E.F Technologies Inc.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
