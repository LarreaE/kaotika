import React, { useState } from 'react';

interface BuyConfirmationModalProps {
  confirmationDetails: {
    currentGold: number;
    newGold: number;  // Oro después de la compra
    item: { // Aquí usamos 'item' como el ingrediente
      _id: string;
      name: string;
      value: number;
      description: string;
      image: string;
      effects: string[];
      type: string;
    };
  };
  handleBuy: (item: any, quantity: number) => void; // Necesitamos la cantidad para la compra
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>;
}

const BuyConfirmationModal: React.FC<BuyConfirmationModalProps> = ({
  confirmationDetails,
  handleBuy,
  setIsConfirming,
}) => {
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad seleccionada

  // Calculamos el costo total en función de la cantidad seleccionada
  const totalCost = confirmationDetails.item.value * quantity;

  // Calculamos el nuevo oro después de la compra
  const newGold = confirmationDetails.currentGold - totalCost;

  // Función para incrementar la cantidad
  const onIncrement = () => {
    setQuantity(quantity + 1); // Incrementar cantidad
  };

  // Función para decrementar la cantidad
  const onDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1); // Decrementar cantidad, pero no menos de 1
  };

  // Función para confirmar la compra
  const onConfirm = () => {
    handleBuy(confirmationDetails.item, quantity); // Pasamos el item y la cantidad seleccionada
    setIsConfirming(false); // Cierra el modal después de confirmar la compra
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-black p-6 rounded-xl shadow-lg text-center w-2/5 border-2 border-sepia">
        <h2 className="text-6xl font-bold text-white mb-4">Confirm Purchase</h2>
        {confirmationDetails && (
          <>
            <p className="mb-2 text-3xl text-white">
              Gold: <strong>{confirmationDetails.currentGold}</strong> ➡ <strong>{newGold}</strong>
            </p>
            <p className="mb-4 text-3xl text-white">
              Are you sure you want to buy <strong>{confirmationDetails.item?.name}</strong> for <strong>{confirmationDetails.item?.value}</strong> gold each?
            </p>

            {/* Imagen del ingrediente */}
            <img
              src={confirmationDetails.item.image}
              alt={confirmationDetails.item.name}
              className="w-32 h-32 object-cover rounded-lg mb-4 mx-auto"
            />

            {/* Descripción */}
            <p className="mb-4 text-xl text-white">{confirmationDetails.item.description}</p>

            <p className="mb-4 text-3xl text-white">
              Total: <strong>{totalCost}</strong> gold
            </p>
            {/* Botones de cantidad */}
            {confirmationDetails.item?.type === 'ingredient' && (
              <div className="flex justify-center items-center gap-4 mb-4">
                <button
                  onClick={onDecrement}
                  className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                >
                  -
                </button>
                <span className="text-3xl text-white">{quantity}</span>
                <button
                  onClick={onIncrement}
                  className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                >
                  +
                </button>
              </div>

            )}
          </>
        )}
        <div className="flex justify-around mt-4">
          <button
            onClick={onConfirm}  // Confirmar compra
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
            Confirm
          </button>
          <button
            onClick={() => setIsConfirming(false)} // Cancelar
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyConfirmationModal;
