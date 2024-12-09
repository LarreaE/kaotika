import React from 'react';

interface BuyConfirmationModalProps {
  confirmationDetails: {
    currentGold: number;
    newGold: number;
    item: {
      name: string;
      value: number;
    };
  };
  handleBuy: (item: any) => void; // Aquí puedes ajustar la función según lo que necesites
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>;
}

const BuyConfirmationModal: React.FC<BuyConfirmationModalProps> = ({
  confirmationDetails,
  handleBuy,
  setIsConfirming,
}) => {
  const onConfirm = () => {
    handleBuy(confirmationDetails.item);
    setIsConfirming(false); // Cierra el modal después de confirmar la compra
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-black p-6 rounded-xl shadow-lg text-center w-2/5 border-2 border-sepia">
        <h2 className="text-6xl font-bold text-white mb-4">Confirm Purchase</h2>
        {confirmationDetails && (
          <>
            <p className="mb-2 text-3xl text-white">
              Gold: <strong>{confirmationDetails.currentGold}</strong> ➡ <strong>{confirmationDetails.newGold}</strong>
            </p>
            <p className="mb-4 text-3xl text-white">
              Are you sure you want to buy <strong>{confirmationDetails.item?.name}</strong> for <strong>{confirmationDetails.item?.value}</strong> gold?
            </p>
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
