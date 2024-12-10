import React, { useState } from "react";
import { Player } from "@/_common/interfaces/Player";
import BuyConfirmationModal from "./BuyConfirmationModal";
import ItemDetailModal from "./ItemDetailsModal";
import NotEnoughMoneyModal from "./ NotEnoughMoneyModal";

interface ItemCardProps {
  item: any;
  player: any;
  handleBuy: (
    item: any,
    player: Player,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    closeModal: () => void
  ) => void;
  handleAddToCart: (
    item: any,
    player: Player,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  player,
  handleBuy,
  handleAddToCart,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // For Buy Confirmation
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeErrorModal = () => {
    setError(null);
  };

  const currentAttributes = player?.attributes || {};
  const currentGold = player?.gold || 0;
  const itemPrice = item?.value || 0;

  const initiateBuy = (selectedItem: any) => {
    handleBuy(selectedItem, player, setError, closeModal);
  };

  const openBuyConfirmationModal = () => {
    if (currentGold >= itemPrice) {
      setIsConfirming(true);
    } else {
      setError("You don't have enough gold to buy this item.");
    }
  };

  const closeBuyConfirmationModal = () => {
    setIsConfirming(false);
  };

  const addToCart = () => {
    if (currentGold >= itemPrice) {
      handleAddToCart(item, player, setError);
    } else {
      setError("You don't have enough gold to add this item to the cart.");
    }
  };

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
              openBuyConfirmationModal();
            }}
          >
            Buy Now
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-black text-xl font-bold rounded hover:bg-gray-200 transition"
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ItemDetailModal
          selectedItem={item}
          currentAttributes={currentAttributes}
          player={player}
          closeModal={closeModal}
          initiateBuy={initiateBuy}
        />
      )}

      {isConfirming && (
        <BuyConfirmationModal
          confirmationDetails={{
            currentGold: currentGold,
            newGold: currentGold - itemPrice,
            item: item,
          }}
          handleBuy={initiateBuy}
          setIsConfirming={setIsConfirming}
        />
      )}

      {error && (
        <NotEnoughMoneyModal errorMessage={error} closeModal={closeErrorModal} />
      )}
    </>
  );
};

export default ItemCard;
