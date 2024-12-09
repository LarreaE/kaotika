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
  }, [Items]);

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
          setError(error || 'Not found');
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
      {loading && <Loading />}
      {error && <div className="text-red-400 text-center font-bold mt-4">{error}</div>}

      {/* Contenedor principal del estilo tipo Skyrim */}
      <div className="mx-auto mt-10 p-6 max-w-md relative
                      bg-black/60 border border-gray-300 text-gray-200
                      rounded shadow-lg">

        {/* Esquinas decorativas simples */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gray-300"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gray-300"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gray-300"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gray-300"></div>
        
        {/* Título */}
        <div className="flex justify-center mb-4">
          <div className="px-4 py-1 bg-black/40 border border-gray-300 uppercase font-bold text-lg tracking-wide">
            Cart
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <p data-testid={'empty-cart'} className="text-center font-medium text-gray-300">
              The cart is empty...
            </p>
          ) : (
            items.map((item:any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded border border-gray-500 bg-black/30 
                           hover:bg-black/50 transition-colors duration-200"
              >
                <span className="font-semibold">
                  {item.name}
                </span>
                <span className="font-medium">
                  {item.value} gold
                </span>
                <button
                  data-testid={`remove_item_${item.id}`}
                  className="px-4 py-1 bg-gray-300 text-black text-sm rounded hover:bg-gray-200 transition"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        
        {items.length > 0 && (
          <div className="mt-6 text-center">
            <div className="mb-4">
              <span 
                data-testid={'total_price'} 
                className="inline-block bg-black/40 border border-gray-300 px-4 py-1 rounded font-bold"
              >
                Total: {calculateTotal()} gold
              </span>
            </div>
            <button
              data-testid={'end_purchase'}
              className="w-full py-2 bg-gray-300 text-black font-bold rounded hover:bg-gray-200 transition"
              onClick={() => handleBuy(items)}
            >
              Purchase Items
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;