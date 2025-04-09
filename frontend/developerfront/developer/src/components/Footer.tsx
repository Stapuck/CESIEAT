import IOSAppIcon from "../assets/IOS_store.svg";
import AndroidAppIcon from "../assets/Android_store.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-tertiary w-full text-white p-4">
      <div className="flex flex-col text-black">
        <div className="flex justify-between">
          <div className="flex flex-col items-start justify-between p-2">
            <div className="font-extrabold text-2xl">CHEF</div>
            <div className="flex items-center">
              <img src={IOSAppIcon} alt="" className="pr-3" />
              <img src={AndroidAppIcon} alt="" className="w-[140px] p2" />
            </div>
          </div>
        </div>
        <div className="flex justify-around items-center mt-4">
          <div className="flex p-2 justify-around">
            <img
              src="https://img.icons8.com/ios/50/000000/facebook-new.png"
              alt="Facebook"
              className="p-2"
            />
            <img
              src="https://img.icons8.com/ios/50/000000/twitter.png"
              alt="Twitter"
              className=" p-2"
            />
            <img
              src="https://img.icons8.com/ios/50/000000/instagram-new.png"
              alt="Instagram"
              className=" p-2"
            />
          </div>

          <div className="flex flex-col">
            <Link to="/developer/faq"> Question fréquente</Link>
            <Link to="/developer/aboutus"> A propos de nous</Link>
            <Link to="/developer/contact"> Nous contacter</Link>
          </div>

          <div className="flex flex-col">
            <Link to="/developer/promotion">Promotion</Link>
            <Link to="/developer/tarif">Tarif</Link>
          </div>
          <div className="flex flex-col">
            <Link to="/developer/confidentialité">
              Politique de confidentialité
            </Link>
            <Link to="/developer/terms"> Condition d'utilisation </Link>
          </div>
        </div>
        <div className="flex justify-end italic items-end mx-4 mt-4">
          <div>© 2025 C.H.E.F Technologies Inc.</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
