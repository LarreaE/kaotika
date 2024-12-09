import React, { useState } from "react";
import { Player } from "@/_common/interfaces/Player";
import ItemDetailModal from "./ItemDetailsModal";

interface ItemCardProps {
  item: any;
  player: Player; // Ajusta el tipo según tu interfaz de Player
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

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
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
              handleBuy(item, player, setError);
            }}
          >
            Buy Now
          </button>
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic en el botón abra el modal
              handleAddToCart(item, player, setError);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 justify-center ">{error}</div>}

      {/* Renderizar el modal si está abierto */}
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
