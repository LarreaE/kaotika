import React, { useState } from 'react';

interface Player {
  id: number;
  name: string;
  gold: number;
}

interface Item {
  _id: number;
  name: string;
  image: string;
  value: number;
  type: string; // e.g., "ingredient", "weapon", etc.
}

interface CartItem {
  item: Item;
  quantity: number;
}

interface Props {
  items: CartItem[];
  emptyCart: () => void;
  removeItem: (item: Item) => void;
  calculateTotalPrice: () => number;
  goToCheckout: () => void;
  onClose: () => void;
  handleAddToCart: (item: Item, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
  handleDecreaseQuantity: (item: Item) => void;
  player: Player;
}

const CartPreview: React.FC<Props> = ({
  items,
  emptyCart,
  removeItem,
  calculateTotalPrice,
  goToCheckout,
  onClose,
  handleAddToCart,
  handleDecreaseQuantity,
  player,
}) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex justify-center items-center h-screen bg-transparent z-50 relative">
      <div
        className="relative w-full max-w-4xl p-6 bg-black/60 text-gray-200 rounded shadow-lg border-sepia border z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Esquinas decorativas */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sepia"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sepia"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sepia"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sepia"></div>

        <div className="flex justify-center mb-4">
          <div className="px-4 py-1 bg-black/40 border-sepia border uppercase font-bold text-xl tracking-wide">
            Cart
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-black/40 border-sepia border rounded-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-black/30">
          {items.length === 0 ? (
            <p className="text-gray-300 text-center">No items in the Cart</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(({ item, quantity }) => (
                <div
                  key={item._id}
                  className="flex items-center bg-black/40 rounded-lg p-4 shadow-md border-sepia border hover:bg-black/60 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md border-sepia border"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                      {item.name}
                    </h3>
                    <p className="text-gray-300">
                      Value: {item.value} gold
                    </p>
                    <p className="text-gray-300">
                      Quantity: {quantity}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center">
                    {/* Conditionally render + and - buttons only if the item type is "ingredient" */}
                    {item.type === "ingredient" && (
                      <>
                        <button
                          onClick={() => handleDecreaseQuantity(item)} // Decrementa cantidad
                          className="bg-black bg-opacity-70 text-white px-3 py-1 rounded border-sepia border hover:bg-neutral-800 hover:bg-opacity-70 transition"
                        >
                          −
                        </button>
                        <button
                          onClick={() => handleAddToCart(item, player, setError)}
                          className="ml-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded border-sepia border hover:bg-neutral-800 hover:bg-opacity-70 transition"
                        >
                          +
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => removeItem(item)} // Elimina completamente
                      className="ml-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded border-sepia border hover:bg-neutral-800 hover:bg-opacity-70 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-lg">
          <span className="inline-block bg-black/40 border-sepia border px-4 py-1 rounded font-bold text-gray-200">
            Price: {calculateTotalPrice()}
          </span>
        </div>

        <button
          onClick={emptyCart}
          className="mt-4 w-full py-1 px-2 text-lg font-semibold bg-black bg-opacity-70 text-white rounded border-sepia border hover:bg-neutral-800 hover:bg-opacity-70 transition"
        >
          Remove All
        </button>
        <button
          onClick={goToCheckout}
          className="mt-2 w-full py-1 px-2 text-lg font-semibold bg-black bg-opacity-70 text-white rounded border-sepia border hover:bg-neutral-800 hover:bg-opacity-70 transition"
        >
          Checkout
        </button>
      </div>
      <button
        onClick={(e) => {
          onClose();
        }}
        className="absolute top-[9%] right-[12%] text-sepia text-3xl font-bold hover:scale-110 transition-transform z-50"
      >
        ×
      </button>
    </div>
  );
};

export default CartPreview;
