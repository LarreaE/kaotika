import React, { useState } from "react";
import { Player } from "@/_common/interfaces/Player";
import BuyConfirmationModal from "./BuyConfirmationModal";
import ItemDetailModal from "./ItemDetailsModal";

interface ItemCardProps {
  item: any;
  player: any;
  handleBuy: (item: any, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>, closeModal: () => void) => void;
  handleAddToCart: (item: any, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  player,
  handleBuy,
  handleAddToCart,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);  // For Buy Confirmation
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Se asume que el jugador tiene un campo 'attributes' y definimos 'currentAttributes'
  const currentAttributes = player?.attributes || {};

  // Función para iniciar la compra
  const initiateBuy = (selectedItem: any) => {
    handleBuy(selectedItem, player, setError, closeModal);  // Pasamos la función para cerrar el modal
  };

  const openBuyConfirmationModal = () => {
    setIsConfirming(true);
  };

  const closeBuyConfirmationModal = () => {
    setIsConfirming(false);
  };

  // Calcular la cantidad de oro del jugador
  const currentGold = player?.gold || 0;
  const itemPrice = item?.value || 0;
  const newGold = currentGold - itemPrice;

  return (
    <>
      <div
        className="relative w-full h-auto p-4 bg-black/60 border border-sepia text-gray-200 rounded shadow-md cursor-pointer 
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
        <strong className="text-gray-200 text-center text-3xl font-semibold px-2 truncate w-full">
          {item.name || "Unnamed Item"}
        </strong>
        <div className="text-gray-300 text-2xl font-medium mt-1">
          Price: {item.value || "N/A"} gold
        </div>
        
        <div className="flex space-x-2 mt-auto pt-2">
          <button
            className="px-3 py-1 bg-gray-300 text-black text-xl font-bold rounded hover:bg-gray-200 transition"
            onClick={(e) => {
              e.stopPropagation();
              openBuyConfirmationModal(); // Open the buy confirmation modal
            }}
          >
            Buy Now
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-black text-xl font-bold rounded hover:bg-gray-200 transition"
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
          selectedItem={item}
          currentAttributes={currentAttributes}
          player={player}
          closeModal={closeModal}
          initiateBuy={initiateBuy}
        />
      )}

      {/* Conditionally render the buy confirmation modal */}
      {isConfirming && (
        <BuyConfirmationModal
          confirmationDetails={{
            currentGold: currentGold,
            newGold: newGold,
            item: item,
          }}
          handleBuy={initiateBuy}
          setIsConfirming={setIsConfirming}
        />
      )}
    </>
  );
};

export default ItemCard;
