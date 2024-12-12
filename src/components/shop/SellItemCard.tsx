import React from 'react';

// Definir la interfaz Item directamente en este archivo
interface Item {
  name: string;
  image: string;
  description: string;
  value: number;
}

interface SellItemCardProps {
  selectedItem: Item | null; // El ítem puede ser null si no hay un ítem seleccionado
}

const SellItemCard: React.FC<SellItemCardProps> = ({ selectedItem }) => {
  return (
    <div className="w-3/5 h-4/6 p-4 bg-black bg-opacity-70 flex flex-col items-center rounded-2xl shadow-lg border-4 border-sepia">
      <div className="w-full text-center bg-medievalSepia py-2 rounded-t-2xl">
        <p className="text-black text-4xl font-bold">
          {selectedItem?.name || 'Select any item'}
        </p>
      </div>
      <div className="w-3/5 mt-4 border-4 border-sepia rounded-xl overflow-hidden shadow-md bg-white flex-shrink-0">
        {selectedItem?.image ? (
          <img
            src={selectedItem.image}
            alt={selectedItem.name || 'Selected Item'}
            className="w-full h-auto object-contain"
          />
        ) : (
          <p className="text-gray-500 text-center p-4">Any item selected</p>
        )}
      </div>
      
      {/* Contenedor de la descripción con altura máxima y scroll si es necesario */}
      <div className="w-full mt-4 text-center max-h-32 overflow-y-auto">
        <p className="text-white text-3xl font-medium">
          {selectedItem?.description || 'Without description'}
        </p>
      </div>
      
      {selectedItem && (
        <div className="w-auto -bottom-12 mt-auto text-center bg-medievalSepia py-1 px-2 rounded-2xl flex flex-row items-center justify-center relative">
          <p className="text-black text-4xl font-bold mr-2">{selectedItem.value}</p>
          <img
            src="/images/shop/gold.png"
            alt="gold coin"
            className="w-12 h-12 ml-2"
          />
        </div>
      )}
    </div>
  );
};

export default SellItemCard;
