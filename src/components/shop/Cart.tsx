import React, { useEffect, useState, useMemo } from "react";
import Loading from "../Loading";
import { useSession } from "next-auth/react";

interface Item {
  _id: string;
  name: string;
  value: number;
  image: string;
  type: string;
}

interface CartItem {
  item: Item;
  quantity: number;
}

interface CartProps {
  Items: CartItem[];
}

const Cart: React.FC<CartProps> = ({ Items }) => {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>(Items);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(Items);
    setLoading(false);
  }, [Items]);

  const calculateTotal = (): number =>
    items.reduce((total, cartItem) => total + cartItem.item.value * cartItem.quantity, 0);
  
  const removeItem = (id: string): void => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.item._id !== id)
    );
  };

  const handleBuy = async(items: CartItem[]) => {
    if (session) {
      try {
        setLoading(true);

        const simplifiedItems = items.map(({ item, quantity }) => ({
          name: item.name,
          type: item.type,
          quantity,
        }));
        const encodedItems = encodeURIComponent(JSON.stringify(simplifiedItems));

        const res = await fetch(`/api/shop/checkout/${session.email}/${encodedItems}`);
        if (res.status === 200) {
          const response = await res.json();
          setItems([]);
          console.log(response);
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
  };

  return (
    <>
      {loading && <Loading />}
      {error && <div className="text-red-400 text-center font-bold mt-4">{error}</div>}

      <div className="mx-auto mt-10 p-6 max-w-md relative bg-black/60 border border-sepia text-gray-200 rounded shadow-lg">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sepia"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sepia"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sepia"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sepia"></div>

        <div className="flex justify-center mb-4">
          <div className="px-4 py-1 bg-black/40 border border-sepia uppercase font-bold text-lg tracking-wide">
            Cart
          </div>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p data-testid={'empty-cart'} className="text-center font-medium text-gray-300">
              The cart is empty...
            </p>
          ) : (
            items.map((cartItem) => (
              <div key={cartItem.item._id} className="flex items-center justify-between p-3 rounded border border-gray-500 bg-black/30 hover:bg-black/50 transition-colors duration-200">
                <img
                  src={cartItem.item.image}
                  alt={cartItem.item.name}
                  className="w-16 h-16 object-contain rounded-full"
                />
                <span>{cartItem.item.name}</span>
                <span>{cartItem.quantity} x {cartItem.item.value} gold</span>
                <div>
                  <button 
                    className="px-4 py-1 bg-gray-300 text-black text-sm rounded hover:bg-gray-200 transition" 
                    onClick={() => removeItem(cartItem.item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-6 text-center">
            <div className="mb-4">
              <span data-testid={'total_price'} className="inline-block bg-black/40 border border-sepia px-4 py-1 rounded font-bold">
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
