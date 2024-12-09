import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { Player } from '@/_common/interfaces/Player';

interface ItemCarouselProps {
  items: any[];
  player: Player | undefined;
  handleBuy: (item: any, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
  handleAddToCart: (item: any, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<any | null>>;
}

const ItemCarousel: React.FC<ItemCarouselProps> = ({
  items,
  player,
  handleBuy,
  handleAddToCart,
  setSelectedItem,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const itemsPerPage = 6; // Mostramos 6 artículos por página
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculamos los índices de los artículos a mostrar
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = items.slice(startIndex, endIndex);

  return (
    <div>
      {/* Botones de navegación */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="text-2xl ml-[2%] z-30 hover:bg-gray-600 transition rounded"
        >
          Back
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage >= totalPages - 1}
          className="text-2xl ml-[90%] hover:bg-gray-600 transition rounded"
        >
          Next
        </button>
      </div>

      {itemsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsToDisplay.map((item: any, index: React.Key) => (
            <div
              key={index}
              onMouseEnter={() => setSelectedItem(item)} // Actualiza el objeto seleccionado al hacer hover
            >
              <ItemCard
                item={item}
                player={player}
                handleBuy={handleBuy}
                handleAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
};

export default ItemCarousel;