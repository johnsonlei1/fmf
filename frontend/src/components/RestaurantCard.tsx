import React from "react";
import { Restaurant } from "./types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (restaurant: Restaurant) => void;
  darkMode?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isFavorite,
  onToggleFavorite,
  darkMode = true,
}) => {
  return (
    <div
      className={`border rounded-md p-4 relative ${
        darkMode
          ? "border-gray-700 hover:border-white text-white" // Light text in dark mode
          : "border-gray-300 hover:border-black text-black" // Dark text in light mode
      } transition-colors`}
    >
      <h5 className="text-xl font-bold">{restaurant.name}</h5>
      <div className="flex items-center mt-2">
        <span className="text-yellow-400">{restaurant.stars} ★</span>
        <span
          className={`ml-2 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ({restaurant.review_count} reviews)
        </span>
      </div>
      <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {restaurant.address}, {restaurant.city}, {restaurant.state}{" "}
        {restaurant.postal_code}
      </p>
      <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {restaurant.categories}
      </p>

      {/* Heart Icon */}
      <div
        onClick={() => onToggleFavorite(restaurant)}
        className="absolute top-4 right-4 cursor-pointer"
      >
        {isFavorite ? (
          <span className="text-red-500 text-2xl">❤️</span>
        ) : (
          <span className="text-gray-500 text-2xl">🤍</span>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;