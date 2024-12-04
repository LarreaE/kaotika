import React from 'react';

interface Item {
  _id: number;
  name: string;
  image: string;
  value: number;
}

interface Props {
  items: Item[];
  emptyCart: () => void;
  removeItem: (item: Item) => void;
  calculateTotalPrice: () => number ;

}

const ItemDisplay: React.FC<Props> = ({ items, emptyCart, removeItem, calculateTotalPrice }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <div className="w-11/12 max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-600">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Inventory</h2>
        <div className="h-96 overflow-y-auto p-4 bg-gray-900 rounded-lg border border-gray-700 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center">No items in inventory</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item: Item) => (
                <div
                  key={item._id}
                  className="flex items-center bg-gray-700 rounded-lg p-4 shadow-md border border-gray-600 hover:bg-gray-600 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md border border-gray-500"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-200">{item.name}</h3>
                    <p className="text-gray-400">Value: {item.value} gold</p>
                  </div>
                  <button
                    onClick={() => removeItem(item)} // Fix applied here
                    className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <span>Price: {calculateTotalPrice()}</span>
        <button
          onClick={emptyCart}
          className="mt-4 w-full py-2 bg-gray-700 text-gray-100 font-semibold rounded-md shadow hover:bg-gray-600 transition"
        >
          Remove All
        </button>
        <button
          onClick={emptyCart}
          className="mt-4 w-full py-2 bg-gray-700 text-gray-100 font-semibold rounded-md shadow hover:bg-gray-600 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ItemDisplay;
