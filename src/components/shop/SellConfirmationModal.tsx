import React from 'react';

const SellConfirmationModal = ({ confirmationDetails, handleSell, setIsConfirming }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-black p-6 rounded-xl shadow-lg text-center w-2/5 border-2 border-sepia">
        <h2 className="text-6xl font-bold text-white mb-4">Confirm Sale</h2>
        {confirmationDetails && (
          <>
            <p className="mb-2 text-3xl text-white">
              Gold: <strong>{confirmationDetails.currentGold}</strong> ➡ <strong>{confirmationDetails.newGold}</strong>
            </p>
            <p className="mb-4 text-3xl text-white">
              Are you sure you want to sell <strong>{confirmationDetails.item?.name}</strong>?
            </p>
          </>
        )}
        <div className="flex justify-around mt-4">
          <button
            onClick={() => handleSell(confirmationDetails?.item)}
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
            Confirm
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellConfirmationModal;
