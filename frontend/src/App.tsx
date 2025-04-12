import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?city=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      setRestaurants(data);
      if (data.length === 0) {
        setError(`No restaurants found in ${searchTerm}`);
      }
    } catch (err) {
      setError("An error occurred while searching");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] relative">
      {/* Navbar absolutely positioned at the top */}
      <Navbar />
      {/* Main content centered */}
      <div className="w-full flex items-center justify-center px-4 pt-20 pb-10">
        <div className="flex flex-col w-full max-w-[800px] text-white items-center">
          <h3 className="text-4xl font-bold mb-10">Are You Hungry?</h3>

          {/* Input field */}
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

          {/* Search button */}
          <div className="w-full flex flex-col mb-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Error message */}
          {error && <div className="text-red-400 mb-4">{error}</div>}

          {/* Results */}
          {restaurants.length > 0 && (
            <div className="w-full mt-8">
              <h4 className="text-2xl font-bold mb-4">
                Restaurants in {searchTerm}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((restaurant, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-md p-4 hover:border-white transition-colors"
                  >
                    <h5 className="text-xl font-bold">{restaurant.name}</h5>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">
                        {restaurant.stars} ★
                      </span>
                      <span className="ml-2 text-gray-400">
                        ({restaurant.review_count} reviews)
                      </span>
                    </div>
                    <p className="mt-2 text-gray-300">
                      {restaurant.address}, {restaurant.city},{" "}
                      {restaurant.state} {restaurant.postal_code}
                    </p>
                    <p className="mt-2 text-gray-400">
                      {restaurant.categories}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
