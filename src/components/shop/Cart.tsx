"use client"
import React, { useState } from "react";

interface CartProps {
    Items: any
}
const Cart: React.FC<CartProps> = ({ Items }) => {
  
  const [items, setItems] = useState(Items);

  
  const updateQuantity = (id:any, delta:any) => {
    setItems((prevItems:any) =>
      prevItems.map((item:any) =>
        item.id === id && item.type === "ingredient"
          ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
          : item
      )
    );
  };

  const calculateTotal = () =>
    items.reduce((total:any, item:any) => total + item.price * item.quantity, 0);
 
  const removeItem = (id:any) => {
    setItems((prevItems:any) => prevItems.filter((item:any) => item.id !== id));
  };

  
  const finalizePurchase = () => {
    setItems([]); 
  };

  return (
    <div className="max-w-full mx-auto mt-10 p-6 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Epic Cart
      </h1>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p data-testid={'empty-cart'} className="text-gray-500 text-center">The Cart is empty.</p>
        ) : (
          items.map((item:any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
            >
              <span className="text-gray-800 font-semibold p-4">{item.name}</span>
              {item.type === "ingredient" ? (
                <div className="flex items-center space-x-4">
                  <button
                    data-testid={`remove_unit_${item.id}`}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span data-testid={`ingredient_qty_${item.id}`} className="text-gray-800 font-medium">
                    {item.quantity}
                  </span>
                  <button
                    data-testid={`add_unit_${item.id}`}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="text-gray-600">Qty: {item.quantity}</span>
              )}
              <span className="text-gray-800 font-semibold p-4">{item.quantity * item.price}</span>
              <button
                data-testid={`remove_item_${item.id}`}
                className="px-6 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition m-4"
                onClick={() => removeItem(item.id)}
              >
                Remove Item
              </button>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <>
        <span data-testid={'total_price'} className="text-gray-600 text-lg font-bold p-2 text-center">Total amount: {calculateTotal()}</span>
        <button
					data-testid={'end_purchase'}
          className="w-full mt-6 py-2 bg-green-500 text-white text-lg font-bold rounded-lg hover:bg-green-600 transition"
          onClick={finalizePurchase}
        >
          Purchase Items
        </button>
        </>
      )}
    </div>
  );
};

export default Cart;