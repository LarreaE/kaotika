"use client"
import React, { useState } from "react";
import ItemDetailsModal from "./ItemDetailsModal";
import { Player } from "@/_common/interfaces/Player";
import ItemDetailModal from "./ItemDetailsModal";

interface ItemCardProps {
  item: any;
  player: any; // Ajusta el tipo según tu interfaz de Player
  handleBuy: (item: any, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
  handleAddToCart: (item: any, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  player,
  handleBuy,
  handleAddToCart,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Se asume que el jugador tiene un campo 'attributes' y definimos 'currentAttributes' 
  const currentAttributes = player?.attributes || {}; // Puedes ajustar esto según cómo esté estructurada tu interfaz de jugador

  // Aquí pasamos la función 'handleBuy' como 'initiateBuy' al modal
  const initiateBuy = (selectedItem: any) => {
    handleBuy(selectedItem, player, setError);
  };

  return (
    <>
      <div
        className="relative w-full h-60 p-4 bg-black/60 border border-sepia text-gray-200 rounded shadow-md cursor-pointer 
                   hover:scale-[1.02] transition-transform duration-200 flex flex-col items-center justify-start"
        onClick={openModal}
      >
        {/* Esquinas decorativas */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sepia"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sepia"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sepia"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sepia"></div>

        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.name || "Unnamed Item"}
          className="w-24 h-24 mb-2 object-contain"
        />
        <strong className="text-gray-200 text-center text-sm font-semibold px-2 truncate w-full">
          {item.name || "Unnamed Item"}
        </strong>
        <div className="text-gray-300 text-sm font-medium mt-1">
          Price: {item.value || "N/A"} gold
        </div>
        
        <div className="flex space-x-2 mt-auto pt-2">
          <button
            className="px-3 py-1 bg-gray-300 text-black text-sm font-bold rounded hover:bg-gray-200 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleBuy(item, player, setError);
            }}
          >
            Buy Now
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-black text-sm font-bold rounded hover:bg-gray-200 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(item, player, setError);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 text-center mt-2">{error}</div>}

      {isModalOpen && (
        <ItemDetailModal
          selectedItem={item} // Pasa el item seleccionado al modal
          currentAttributes={currentAttributes} // Pasa los atributos actuales del jugador
          player={player} // Pasa los datos del jugador
          closeModal={closeModal} // Función para cerrar el modal
          initiateBuy={initiateBuy} // Función para iniciar la compra
        />
      )}
    </>
  );
};

export default ItemCard;
