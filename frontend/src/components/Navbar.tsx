import { Link } from "react-router-dom";
import Image from "../assets/fmf_icon.png";

function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full p-5 z-10">
      <div className="flex justify-between items-center w-full">
        {/* Left side: Brand or title link */}
        <Link to="/App" className="cursor-pointer">
          <img src={Image} alt="Logo" className="h-10" />
        </Link>

        {/* Right side: Buttons */}
        <div className="space-x-2.5">
          <Link
            to="/Profile"
            className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors"
          >
            Profile
          </Link>
          <Link
            to="/Donation"
            className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors"
          >
            Donation
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
