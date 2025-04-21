import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import Image from "../assets/fmf_icon.png";
import ImageDark from "../assets/fmf_icon_black.png";

function Navbar() {
  const { darkMode } = useTheme();
  return (
    <div className="absolute top-0 left-0 w-full p-5 z-10">
      <div className="flex justify-between items-center w-full">
        {/* Left side: Brand or title link */}
        <Link to="/App" className="cursor-pointer">
          <img src={darkMode ? Image : ImageDark} alt="Logo" className="h-10" />
        </Link>

        {/* Right side: Buttons */}
        <div className="space-x-2.5">
          <Link
            to="/Profile"
            className={`${
              darkMode
                ? "bg-[#1a1a1a] border border-white text-white"
                : "bg-white border border-[#1a1a1a] text-[#1a1a1a]"
            } font-semibold rounded-md px-4 py-2 text-center cursor-pointer ${
              darkMode
                ? "hover:bg-white hover:text-[#1a1a1a]"
                : "hover:bg-[#1a1a1a] hover:text-white"
            } transition-colors`}
          >
            Profile
          </Link>
          <Link
            to="/Donation"
            className={`${
              darkMode
                ? "bg-[#1a1a1a] border border-white text-white"
                : "bg-white border border-[#1a1a1a] text-[#1a1a1a]"
            } font-semibold rounded-md px-4 py-2 text-center cursor-pointer ${
              darkMode
                ? "hover:bg-white hover:text-[#1a1a1a]"
                : "hover:bg-[#1a1a1a] hover:text-white"
            } transition-colors`}
          >
            Donation
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
