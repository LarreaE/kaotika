"use client"
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { useSession } from "next-auth/react";

interface CartProps {
    Items: any
}
const Cart: React.FC<CartProps> = ({ Items }) => {
  
  const { data: session, status } = useSession();
  const [items, setItems] = useState(Items);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setItems(Items);
    setLoading(false);
  }, [Items])
  
  
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
    items.reduce((total:any, item:any) => total + item.value , 0);
 
  const removeItem = (id:any) => {
    setItems((prevItems:any) => prevItems.filter((item:any) => item._id !== id));
  };

  
  const handleBuy = async(items:any[]) => {
  
    if (session) {
      try {
        setLoading(true);

        const simplifiedItems = items.map(({ type, name }) => ({ type, name }));
        const encodedItems = encodeURIComponent(JSON.stringify(simplifiedItems));

        const res = await fetch(`/api/shop/checkout/${session.email}/${encodedItems}`);
        if (res.status === 200) {
          const response = await res.json();
          setItems([]);
          console.log(response)
        } else if (res.status === 404) {
          setError(error);
          console.log(error);
        } else {
          setError('An error occurred while purchasing');
        }
      } catch (error) {
        console.error('Failed to complete purchase:', error);
        setError('Failed to complete purchase');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
    {loading && <Loading/>}
    {error && <div className="text-red-600">{error}</div>}
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
              <span className="text-gray-800 font-semibold p-4">{item.value}</span>
              <button
                data-testid={`remove_item_${item.id}`}
                className="px-6 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition m-4"
                onClick={() => removeItem(item._id)}
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
          onClick={() => handleBuy(items)}
        >
          Purchase Items
        </button>
        </>
      )}
      </div>
    </>
  );
};

export default Cart;