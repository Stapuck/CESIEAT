import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <nav className="bg-gray-800 flex items-center justify-between p-4">
      <Link to="/restaurateur/" className="text-white text-2xl font-bold">
        Restaurateur Front
      </Link>
      <button onClick={toggleSidebar} className="text-white lg:hidden">
        <FaBars size={24} />
      </button>
    </nav>
  );
};

export default Navbar;