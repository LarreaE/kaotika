import React from "react";

interface ItemCardProps {
  item: {
    image: string;
    name: string;
    value: number;
    description: string;
  };
  player: any; // Ajusta el tipo según tu interfaz de Player
  handleBuy: (item: any, player: any) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, player, handleBuy }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col items-center">
      <img
        src={item.image || "/placeholder.jpg"}
        alt={item.name || "Unnamed Item"}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <strong className="text-lg mb-2">{item.name || "Unnamed Item"}</strong>
      <div className="text-red-700">Price: ${item.value || "N/A"}</div>
      <div className="text-sm text-gray-500 my-2">
        {item.description || "No description available"}
      </div>
      <button
        className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => handleBuy(item, player)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default ItemCard;