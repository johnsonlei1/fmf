import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full p-5 z-10">
      <div className="flex justify-between items-center w-full">
        {/* Left side: Brand or title link */}
        <Link to="/App" className="text-white text-xl font-bold cursor-pointer">
          Find My Food
        </Link>

        {/* Right side: Buttons */}
        <div className="space-x-2.5">
          <Link
            to="/Signout"
            className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer"
          >
            Signout
          </Link>
          <Link
            to="/Profile"
            className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
