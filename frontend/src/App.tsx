import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import RestaurantCard from "./components/RestaurantCard";

// Firebase imports
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Restaurant {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  stars: number;
  review_count: number;
  categories: string;
  hours: string;
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
    <div className="w-full min-h-screen bg-[#1a1a1a] relative">
      <Navbar />
      <div className="w-full flex items-center justify-center px-4 pt-20 pb-10">
        <div className="flex flex-col w-full max-w-[800px] text-white items-center">
          <h3 className="text-4xl font-bold mb-10">Are You Hungry?</h3>

          <div className="w-full flex flex-col mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a city..."
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="w-full flex flex-row gap-4 mb-6">
            <div className="flex-1">
              <select
                className="w-full text-white py-2 bg-[#1a1a1a] border-b border-gray-500 focus:outline-none focus:border-white"
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
              <select
                className="w-full text-white py-2 bg-[#1a1a1a] border-b border-gray-500 focus:outline-none focus:border-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="Indian">Indian</option>
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col mb-4">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors"
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
                    darkMode={true}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#1a1a1a] transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage * resultsPerPage >= totalResults}
                  className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#1a1a1a] transition-colors"
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
