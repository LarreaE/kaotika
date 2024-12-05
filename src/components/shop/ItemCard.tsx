// src/components/shop/ItemCard.tsx

import React, { useState } from "react";
import ItemDetailsModal from "./ItemDetailsModal"; // Importa el nuevo componente

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="border border-yellow-500 rounded-lg shadow-md p-4 flex flex-col items-center w-full h-60 bg-cover bg-center transform transition duration-300 hover:scale-105 cursor-pointer"
        style={{
          backgroundImage: `url('/images/item_background.jpg')`,
        }}
        onClick={openModal}
      >
        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.name || "Unnamed Item"}
          className="w-32 h-32 mb-4 object-contain"
        />
        <strong className="text-lg mb-2 text-white truncate text-center w-full">
          {item.name || "Unnamed Item"}
        </strong>
        <div className="text-yellow-400">
          Price: ${item.value || "N/A"}
        </div>
        <div className="flex space-x-2 mt-auto">
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic en el botón abra el modal
              handleBuy(item, player);
            }}
          >
            Buy Now
          </button>
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic en el botón abra el modal
              handleAddToCart(item, player);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Renderizar el modal si está abierto */}
      {isModalOpen && (
        <ItemDetailsModal item={item} onClose={closeModal} />
      )}
    </>
  );
};

export default ItemCard;