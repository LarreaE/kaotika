import React from "react";

interface NotEnoughMoneyModalProps {
  errorMessage: string;
  closeModal: () => void;
}

const NotEnoughMoneyModal: React.FC<NotEnoughMoneyModalProps> = ({ errorMessage, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-4/5 max-w-lg p-6 rounded-xl shadow-lg relative border-2 border-sepia bg-black bg-opacity-70">
        {/* Botón de cierre */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white text-xl font-bold bg-sepia bg-opacity-70 rounded-full px-3 py-1 hover:bg-opacity-90 border-2 border-sepia"
        >
          X
        </button>
        <div className="text-center">
          <h2 className="text-red-500 text-3xl font-bold mb-4">Insufficient Gold</h2>
          <p className="text-gray-300 text-2xl">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default NotEnoughMoneyModal;
