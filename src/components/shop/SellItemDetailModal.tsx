import React from 'react';
import ItemStats from './ItemStats';
import ItemBaseStats from './ItemBaseStats';

const SellItemDetailModal = ({ selectedItem, currentAttributes, player, closeModal, initiateSell }) => {
  // Función para iniciar la venta y cerrar el modal
  const handleSellClick = () => {
    initiateSell(selectedItem); // Inicia la venta
    closeModal(); // Cierra el modal después de la venta
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-4/5 max-w-6xl p-8 rounded-xl shadow-lg relative border-2 border-sepia bg-black bg-opacity-70">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white text-xl font-bold bg-sepia bg-opacity-70 rounded-full px-3 py-1 hover:bg-opacity-90 border-2 border-sepia">
          X
        </button>
        <div className="flex flex-row gap-6">
          {/* Si el objeto es un ingrediente */}
          {selectedItem?.type === 'ingredient' ? (
            <>
              {/* Imagen del ítem */}
              <div className="w-1/3 flex items-center justify-center rounded-lg p-4">
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.name || 'Selected Item'}
                  className="w-full h-full max-h-96 object-contain rounded-lg shadow-md border-2 border-sepia"
                />
              </div>
              {/* Nombre, descripción y botón de venta */}
              <div className="w-2/3 flex flex-col justify-center items-center text-center">
                <p className="text-white text-3xl font-bold mb-4">
                  {selectedItem?.name || 'Unnamed Item'}
                </p>
                <p className="text-white text-xl mb-6">
                  {selectedItem?.description || 'No description available.'}
                </p>
                <button
                  onClick={handleSellClick} // Usamos la nueva función aquí
                  className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
                  Sell for {Math.floor(selectedItem.value / 3)}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Estadísticas del ítem */}
              <div className="w-1/3 flex items-center justify-center rounded-xl p-4">
                <ItemStats
                  className="rounded-3xl border-sepia border-2 w-full"
                  selectedItem={selectedItem}
                  atributtes={currentAttributes}
                  player={player}
                />
              </div>
              {/* Imagen del ítem */}
              <div className="w-1/3 flex items-center justify-center rounded-lg p-4">
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.name || 'Selected Item'}
                  className="w-full h-full max-h-96 object-contain rounded-lg shadow-md border-2 border-sepia"
                />
              </div>
              {/* Descripción y acciones */}
              <div className="w-1/3 flex flex-col justify-center items-center text-center">
                <p className="text-white text-2xl mb-6 p-2">
                  {selectedItem?.description || 'Selecciona un elemento para ver sus estadísticas.'}
                </p>
                {selectedItem ? (
                  <ItemBaseStats selectedItem={selectedItem} player={player} />
                ) : (
                  <div className="text-center text-gray-500 italic">
                    Selecciona un elemento para ver sus estadísticas.
                  </div>
                )}
                <div className="flex space-x-4 mt-auto p-2">
                  {selectedItem && (
                    <button
                      onClick={handleSellClick} // Usamos la nueva función aquí
                      className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
                      Sell for {Math.floor(selectedItem.value / 3)}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellItemDetailModal;
