import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [activeTab, setActiveTab] = useState("settings"); // Track active tab
  const [darkMode, setDarkMode] = useState(true); // Track dark/light mode
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens)
    navigate("/Login"); // Redirect to login page
  };

  const favorites = [
    {
      name: "Favorite Restaurant 1",
      address: "123 Main St",
      city: "City",
      state: "State",
      postal_code: "12345",
      stars: 4.5,
      review_count: 120,
      categories: "Italian, Pizza",
    },
    {
      name: "Favorite Restaurant 2",
      address: "456 Elm St",
      city: "City",
      state: "State",
      postal_code: "67890",
      stars: 4.0,
      review_count: 80,
      categories: "Mexican, Tacos",
    },
  ];

  return (
    <div
      className={`w-full h-screen ${
        darkMode ? "bg-[#1a1a1a]" : "bg-white"
      } relative`}
    >
      {/* <Navbar /> */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={`w-1/4 h-full ${
            darkMode ? "bg-[#282c34]" : "bg-gray-200"
          } p-4`}
        >
          <ul className="space-y-4">
            <li
              className={`cursor-pointer p-2 rounded ${
                activeTab === "settings"
                  ? "bg-[#282c34] text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${
                activeTab === "favorites"
                  ? "bg-[#282c34] text-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 h-full p-6">
          {activeTab === "settings" && (
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-[#282c34] text-white" : "bg-gray-100 text-black"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Favorites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((favorite, index) => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 ${
                      darkMode
                        ? "border-gray-700 hover:border-white"
                        : "border-gray-300 hover:border-black"
                    } transition-colors`}
                  >
                    <h5 className="text-xl font-bold">{favorite.name}</h5>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">
                        {favorite.stars} ★
                      </span>
                      <span className="ml-2 text-gray-400">
                        ({favorite.review_count} reviews)
                      </span>
                    </div>
                    <p className="mt-2 text-gray-300">
                      {favorite.address}, {favorite.city}, {favorite.state}{" "}
                      {favorite.postal_code}
                    </p>
                    <p className="mt-2 text-gray-400">{favorite.categories}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Home and Logout Button */}
      <div className="absolute bottom-5 right-5 flex gap-4">
        <button
          onClick={() => navigate("/app")} // Assuming Home navigates to "/"
          className="bg-transparent border border-white text-white font-semibold rounded-md px-4 py-2 text-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors"
        >
          Home
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
