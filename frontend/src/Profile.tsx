import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import RestaurantCard from "./components/RestaurantCard";

interface Restaurant {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  stars: number;
  review_count: number;
  categories: string;
  hours?: string;
}

function Profile() {
  const [activeTab, setActiveTab] = useState("settings");
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.favorites) {
          setFavorites(data.favorites);
        }
      }

      setUserLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    navigate("/Login");
  };

  const toggleFavorite = async (restaurant: Restaurant) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to manage favorites.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some(
        (fav) => fav.name === restaurant.name
      );
      let updatedFavorites;

      if (isFavorited) {
        // Remove from favorites
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.name !== restaurant.name
        );
      } else {
        // Add to favorites (not needed in this case, but keeping for consistency)
        updatedFavorites = [...prevFavorites, restaurant];
      }

      // Update Firestore
      const serializedFavorites = updatedFavorites.map(
        ({ name, address, city, state, postal_code, stars, review_count, categories, hours }) => ({
          name, address, city, state, postal_code, stars, review_count, categories, hours
        })
      );

      setDoc(userRef, { favorites: serializedFavorites }, { merge: true }).catch((err) => {
        console.error("❌ Failed to sync favorites:", err);
      });

      return updatedFavorites;
    });
  };

  return (
    <div
      className={`w-full h-screen ${
        darkMode ? "bg-[#1a1a1a]" : "bg-white"
      } relative`}
    >
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
        <div className="w-3/4 h-full p-6 overflow-y-auto">
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
                    darkMode ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Favorites</h2>

              {!userLoaded ? (
                <p className="text-gray-400">Loading your favorites...</p>
              ) : favorites.length === 0 ? (
                <p className="text-gray-400">
                  You haven’t saved any favorites yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((fav, idx) => (
                    <RestaurantCard
                      key={idx}
                      restaurant={fav}
                      isFavorite={true} // Always true for favorites
                      onToggleFavorite={toggleFavorite}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Home + Logout */}
      <div className="absolute bottom-5 right-5 flex gap-4">
        <button
          onClick={() => navigate("/app")}
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
