import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import RestaurantCard from "./components/RestaurantCard";
import { useTheme } from "./Context/ThemeContext";
// Firebase imports
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Restaurant } from "./components/RestaurantCard";

const App = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 20;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []);
      } else {
        await setDoc(userRef, { favorites: [] });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategoryOptions(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const toggleFavorite = async (restaurant: Restaurant) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to favorite restaurants.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some(
        (fav) => fav.name === restaurant.name
      );
      let updatedFavorites;

      if (isFavorited) {
        updatedFavorites = prevFavorites.filter(
          (fav) => fav.name !== restaurant.name
        );
      } else {
        updatedFavorites = [...prevFavorites, restaurant];
      }

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

  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?city=${searchTerm}&page=${page}&limit=${resultsPerPage}&stars=${starFilter}&category=${categoryFilter}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      setRestaurants(data.results);
      setTotalResults(data.total);
      setCurrentPage(data.page);
      if (data.results.length === 0) {
        setError(`No restaurants found in ${searchTerm}`);
      }
    } catch (err) {
      setError("An error occurred while searching");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage * resultsPerPage < totalResults) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };

  return (
    <div className={`w-full min-h-screen ${darkMode ? "bg-[#1a1a1a]" : "bg-white"} relative`}>
      <Navbar />
      <div className="w-full flex items-center justify-center px-4 pt-20 pb-10">
        <div className={`flex flex-col w-full max-w-[800px] ${darkMode ? "text-white" : "text-[#1a1a1a]"} items-center`}>
          <h3 className="text-4xl font-bold mb-10">Are You Hungry?</h3>

          <div className="w-full flex flex-col mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a city..."
              className={`w-full py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none ${darkMode ? "focus:border-white text-white" : "focus:border-[#1a1a1a] text-[#1a1a1a]"}`}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="w-full flex flex-row gap-4 mb-6">
            <div className="flex-1">
              <select
                className={`w-full py-2 ${darkMode ? "bg-[#1a1a1a]" : "bg-white"} border-b border-gray-500 focus:outline-none focus:border-white ${darkMode ? "text-white" : "text-[#1a1a1a]"}`}
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="1">★ and up</option>
                <option value="2">★★ and up</option>
                <option value="3">★★★ and up</option>
                <option value="4">★★★★ and up</option>
                <option value="5">★★★★★ only</option>
              </select>
            </div>

            <div className="flex-1">
              <input
                list="category-suggestions"
                type="text"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="Filter by category (e.g., sushi, tacos, vegan)"
                className={`w-full py-2 bg-transparent border-b border-gray-500 focus:outline-none ${darkMode ? "focus:border-white text-white" : "focus:border-[#1a1a1a] text-[#1a1a1a]"}`}
              />
              <datalist id="category-suggestions">
                {categoryOptions.map((cat, idx) => (
                  <option key={idx} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="w-full flex flex-col mb-4">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className={`w-full bg-transparent border ${darkMode ? "border-white text-white" : "border-[#1a1a1a] text-[#1a1a1a]"} my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer ${darkMode ? "hover:bg-white hover:text-[#1a1a1a]" : "hover:bg-[#1a1a1a] hover:text-white"} transition-colors`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error && <div className="text-red-400 mb-4">{error}</div>}

          {restaurants.length > 0 && (
            <div className="w-full mt-8">
              <h4 className="text-2xl font-bold mb-4">
                Restaurants in {searchTerm}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={index}
                    restaurant={restaurant}
                    isFavorite={favorites.some(
                      (fav) => fav.name === restaurant.name
                    )}
                    onToggleFavorite={toggleFavorite}
                    darkMode={darkMode}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`bg-transparent border ${darkMode ? "border-white text-white" : "border-[#1a1a1a] text-[#1a1a1a]"} px-4 py-2 rounded-md ${darkMode ? "hover:bg-white hover:text-[#1a1a1a]" : "hover:bg-[#1a1a1a] hover:text-white"} transition-colors`}
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage * resultsPerPage >= totalResults}
                  className={`bg-transparent border ${darkMode ? "border-white text-white" : "border-[#1a1a1a] text-[#1a1a1a]"} px-4 py-2 rounded-md ${darkMode ? "hover:bg-white hover:text-[#1a1a1a]" : "hover:bg-[#1a1a1a] hover:text-white"} transition-colors`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;