import React, { useState } from 'react';

// Definir las interfaces para las props y tipos de datos
interface Item {
  _id: string;
  name: string;
  description: string;
  value: number; // El valor del item en oro
  effects: string[];
  image: string;
  type: 'ingredient' | 'other'; // Tipo de item (puede ser más de un tipo)
  qty: number; // Cantidad disponible del item
}

interface ConfirmationDetails {
  item: Item; // Ahora item es obligatorio
  currentGold: number; // Oro actual del jugador
}

interface SellConfirmationModalProps {
  confirmationDetails: ConfirmationDetails; // confirmationDetails es obligatorio
  handleSell: (item: Item, quantity: number) => void;
  setIsConfirming: (isConfirming: boolean) => void;
}

const SellConfirmationModal: React.FC<SellConfirmationModalProps> = ({
  confirmationDetails,
  handleSell,
  setIsConfirming,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    const maxQty = confirmationDetails?.item?.qty || 1;
    setQuantity((prevQuantity) => {
      if (type === 'increment') {
        return Math.min(prevQuantity + 1, maxQty); // Aumenta la cantidad, pero no más que el máximo
      } else if (type === 'decrement') {
        return Math.max(prevQuantity - 1, 1); // Disminuye la cantidad, pero no menos que 1
      }
      return prevQuantity;
    });
  };

  // Cálculo del oro basado en la cantidad seleccionada
  let totalGold = confirmationDetails.item.value * quantity;

  // Redondear totalGold a un múltiplo de 3
  totalGold = Math.floor(totalGold / 3);

  const newGold = confirmationDetails.currentGold + totalGold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-black p-6 rounded-xl shadow-lg text-center w-2/5 border-2 border-sepia">
        <h2 className="text-6xl font-bold text-white mb-4">Confirmar Venta</h2>
        <p className="mb-2 text-3xl text-white">
          Oro actual: <strong>{confirmationDetails.currentGold}</strong> ➡{' '}
          <strong>{newGold}</strong>
        </p>
        <p className="mb-4 text-3xl text-white">
          ¿Estás seguro de que quieres vender <strong>{confirmationDetails.item?.name}</strong>?
        </p>
        {confirmationDetails.item?.type === 'ingredient' && (
          <div className="mb-4">
            <label className="block text-white text-xl mb-2">Selecciona la cantidad:</label>
            <div className="flex items-center justify-center space-x-4">
              {/* Botón de Decrementar */}
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="text-white text-2xl font-bold p-3 border-2 border-sepia rounded-lg hover:bg-neutral-800"
                style={{ width: '50px', height: '50px' }}
              >
                -
              </button>

              {/* Texto de cantidad */}
              <span className="text-white text-3xl px-4">{quantity}</span>

              {/* Botón de Incrementar */}
              <button
                onClick={() => handleQuantityChange('increment')}
                className="text-white text-2xl font-bold p-3 border-2 border-sepia rounded-lg hover:bg-neutral-800"
                style={{ width: '50px', height: '50px' }}
              >
                +
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-around mt-4">
          <button
            onClick={() => handleSell(confirmationDetails.item, quantity)} // Ya no necesitamos comprobar si item existe
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
          >
            Confirmar
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellConfirmationModal;
