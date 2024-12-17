import React, { useState } from 'react';
import ItemStats from './ItemStats';
import ItemBaseStats from './ItemBaseStats';
import BuyConfirmationModal from './BuyConfirmationModal';
import NotEnoughMoneyModal from './ NotEnoughMoneyModal';

const ItemDetailModal = ({ selectedItem, currentAttributes, player, closeModal, initiateBuy }) => {
  const [isConfirming, setIsConfirming] = useState(false); // Estado para el modal de confirmación
  const [error, setError] = useState<string | null>(null); // Estado para el modal de error

  const openBuyConfirmationModal = () => {
    const currentGold = player?.gold || 0;
    const itemPrice = selectedItem?.value || 0;

    if (currentGold >= itemPrice) {
      setIsConfirming(true);
    } else {
      setError("You don't have enough gold to buy this item.");
    }
  };

  const closeBuyConfirmationModal = () => {
    setIsConfirming(false);
  };

  const closeErrorModal = () => {
    setError(null);
  };

  const currentGold = player?.gold || 0;
  const itemPrice = selectedItem?.value || 0;
  const newGold = currentGold - itemPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-4/5 max-w-6xl p-8 rounded-xl shadow-lg relative border-2 border-sepia bg-black bg-opacity-70">
        {/* Botón de cierre del modal */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white text-xl font-bold bg-sepia bg-opacity-70 rounded-full px-3 py-1 hover:bg-opacity-90 border-2 border-sepia"
        >
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
              {/* Nombre, descripción y botón de compra */}
              <div className="w-2/3 flex flex-col justify-center items-center text-center">
                <p className="text-white text-3xl font-bold mb-4">
                  {selectedItem?.name || 'Unnamed Item'}
                </p>
                <p className="text-white text-3xl mb-6">
                  {selectedItem?.description || 'No description available.'}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openBuyConfirmationModal(); // Abrir el modal de confirmación o mostrar error
                  }}
                  className="bg-black bg-opacity-70 text-white text-3xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                >
                  Buy for {itemPrice}
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
                <p className="text-white text-3xl mb-6 p-2">
                  {selectedItem?.description || 'Select an item to view stats.'}
                </p>
                {selectedItem ? (
                  <ItemBaseStats selectedItem={selectedItem} player={player} />
                ) : (
                  <div className="text-center text-4xl text-white italic">
                    Select an item to view stats.
                  </div>
                )}
                <div className="flex space-x-4 mt-auto p-2">
                  {selectedItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBuyConfirmationModal(); // Abrir el modal de confirmación o mostrar error
                      }}
                      className="bg-black bg-opacity-70 text-white text-3xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                    >
                      Buy for {itemPrice}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación de compra */}
      {isConfirming && (
        <BuyConfirmationModal
          confirmationDetails={{
            currentGold: currentGold,
            newGold: newGold,
            item: selectedItem,
          }}
          handleBuy={() => {
            initiateBuy(selectedItem); // Realizar la compra
            closeBuyConfirmationModal(); // Cerrar el modal de confirmación
            closeModal(); // Cerrar el modal principal
          }}
          setIsConfirming={setIsConfirming} // Para controlar el estado del modal de confirmación
        />
      )}
      {error && <NotEnoughMoneyModal errorMessage={error} closeModal={closeErrorModal} />}
    </div>
  );
};

export default ItemDetailModal;
