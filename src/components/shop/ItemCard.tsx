import React from "react";

interface ItemCardProps {
  item: {
    image: string;
    name: string;
    value: number;
    description?: string;
  };
  player: any; // Ajusta el tipo según tu interfaz de Player
  handleBuy: (item: any, player: any) => void;
  handleAddToCart: (item: any, player: any) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  player,
  handleBuy,
  handleAddToCart,
}) => {
  return (
    <div
      className="border border-yellow-500 rounded-lg shadow-md p-4 flex flex-col items-center w-full h-60 bg-cover bg-center transform transition duration-300 hover:scale-105"
      style={{
        backgroundImage: `url('/images/item_background.jpg')`,
      }}
    >
      <img
        src={item.image || "/placeholder.jpg"}
        alt={item.name || "Unnamed Item"}
        className="w-32 h-32 mb-4 object-contain"
      />
      <strong className="text-lg mb-2 text-white truncate text-center w-full">
        {item.name || "Unnamed Item"}
      </strong>
      <div className="text-yellow-900 text-xl"> {item.value || "N/A"}€</div>
      <div className="flex space-x-2 mt-auto">
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          onClick={() => handleBuy(item, player)}
        >
          Buy Now
        </button>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          onClick={() => handleAddToCart(item, player)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;