import React, { useState } from 'react';

interface Item {
  _id: string;
  name: string;
  description: string;
  value: number;
  effects: string[];
  image: string;
  type: 'ingredient' | 'other';
  qty: number;
}

interface ConfirmationDetails {
  item: Item;
  currentGold: number;
}

interface SellConfirmationModalProps {
  confirmationDetails: ConfirmationDetails | any;
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
        return Math.min(prevQuantity + 1, maxQty);
      } else if (type === 'decrement') {
        return Math.max(prevQuantity - 1, 1)
      }
      return prevQuantity;
    });
  };

  let totalGold = confirmationDetails.item.value * quantity;

  totalGold = Math.floor(totalGold / 3);

  const newGold = confirmationDetails.currentGold + totalGold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-black p-6 rounded-xl shadow-lg text-center w-2/5 border-2 border-sepia">
        <h2 className="text-5xl font-bold text-white mb-4">Confirm Sell</h2>
        <p className="mb-2 text-3xl text-white">
          Actual Gold: <strong>{confirmationDetails.currentGold}</strong> ➡{' '}
          <strong>{newGold}</strong>
        </p>
        <p className="mb-2 text-3xl text-white">
          ¿Are you sure you want to sell  <strong>{confirmationDetails.item?.name}</strong>?
        </p>
        {confirmationDetails.item?.type === 'ingredient' && (
          <div className="mb-4">
            <label className="block text-white text-3xl mb-4">Select the quantity:</label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="text-white text-2xl font-bold p-3 border-2 border-sepia rounded-lg hover:bg-neutral-800"
                style={{ width: '50px', height: '50px' }}
              >
                -
              </button>

              <span className="text-white text-4xl font-semibold px-4">{quantity}</span>

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
            onClick={() => setIsConfirming(false)}
            className="bg-black bg-opacity-70 text-white text-3xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSell(confirmationDetails.item, quantity)}
            className="bg-black bg-opacity-70 text-white text-3xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
};

export default SellConfirmationModal;
