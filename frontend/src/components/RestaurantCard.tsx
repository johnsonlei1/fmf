import React from "react";

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
          ? "border-gray-700 hover:border-white"
          : "border-gray-300 hover:border-black"
      } transition-colors`}
    >
      <h5 className="text-xl font-bold">{restaurant.name}</h5>
      <div className="flex items-center mt-2">
        <span className="text-yellow-400">{restaurant.stars} ★</span>
        <span className="ml-2 text-gray-400">
          ({restaurant.review_count} reviews)
        </span>
      </div>
      <p className="mt-2 text-gray-300">
        {restaurant.address}, {restaurant.city}, {restaurant.state}{" "}
        {restaurant.postal_code}
      </p>
      <p className="mt-2 text-gray-400">{restaurant.categories}</p>

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