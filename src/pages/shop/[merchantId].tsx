import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { Player } from '@/_common/interfaces/Player';

import MerchantInfo from '@/components/shop/MerchantInfo';
import ItemStats from '@/components/shop/ItemStats';
import ItemCarousel from '@/components/shop/ItemCarousel';
import CartPreview from '@/components/shop/CartPreview';
import { calculateAllAttributes } from '@/helpers/PlayerAttributes';
import { Modifier } from '@/_common/interfaces/Modifier';
import { transformStringLowerPlural } from '@/helpers/transformString';
import NotEnoughMoneyModal from '@/components/shop/ NotEnoughMoneyModal';

const MerchantPage = () => {

  interface Item {
    _id: number;
    name: string;
    image: string;
    value: number;
    type: string;
    quantity: number;
  }

  const { data: session, status } = useSession();
  const router = useRouter();
  const { merchantId } = router.query;

  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{ item: Item; quantity: number }[]>([]);
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [currentAttributes, setCurrentAttributes] = useState<Modifier>();


  const [showCartModal, setShowCartModal] = useState<boolean>(false);

  useEffect(() => {
    if (status === 'loading' || !session || !merchantId) return;

    const fetchShopItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shop/merchants/${merchantId}`);
        const itemsData = await response.json();
        console.log(itemsData);

        setItems(itemsData);
      } catch (error) {
        console.error('Failed to fetch merchant items:', error);
      } finally {
        if (player) {
          setLoading(false);
        }
      }
    };

    fetchShopItems();
  }, [merchantId]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchPlayerData = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/shop/player?email=${session.user?.email}`
          );
          if (res.status === 200) {
            const response = await res.json();
            console.log(response);
            setPlayer(response);
          } else if (res.status === 404) {
            const response = await res.json();
          } else {
            setError('An error occurred while checking registration');
          }
        } catch (error) {
          setError('An error occurred while checking registration');
        } finally {
          setLoading(false);
        }
      };

      fetchPlayerData();
    }
  }, [session]);

  useEffect(() => {availableMoney
    if (player) {
      calculateAllAttributes(player, setCurrentAttributes);
      setAvailableMoney(player?.gold || 0);
    }
  }, [player]);

  const checkItemInsidePlayer = (item: Item, player: any): boolean => {
    const type = transformStringLowerPlural(item.type);

    if (item.type === 'ingredient') {
      return false;
    }

    if (player.inventory[type]) {
      const foundItem = player.inventory[type].find((inventoryItem: Item) => inventoryItem._id === item._id);
      return !!foundItem;
    } else {
      console.log(`Category "${type}" does not exist in the inventory.`);
      return false;
    }
  };

  const handleBuy = async (item: Item, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    setError(null)
    console.log(item);
    if (player.gold >= item.value) {
      console.log('Available');
      if (!checkItemInsidePlayer(item, player)) {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/shop/${player.email}/${merchantId}/${item.name}`
          );
          if (res.status === 200) {
            const response = await res.json();
            console.log(response);
            setPlayer(response);
            setCartItems([]);
          } else if (res.status === 404) {
            console.log(error);
          } else {
            setError('An error occurred while checking registration');
          }
        } catch (error) {
          console.error('Failed to complete purchase:', error);
          setError('Failed to complete purchase');
        } finally {
          setLoading(false);
        }
      } else {
        console.log("player already has this item");
        setError('Item already in inventory');
      }
    } else {
      console.log('Unavailable');
    }
  };

  const handleDecreaseQuantity = (item: Item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.item._id === item._id
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      const currentQuantity = updatedCartItems[existingItemIndex].quantity;

      if (currentQuantity > 1) {
        updatedCartItems[existingItemIndex].quantity -= 1;
      } else {
        updatedCartItems.splice(existingItemIndex, 1);
      }

      setCartItems(updatedCartItems);
      setAvailableMoney((prev) => prev + item.value);
    }
  };

  const handleAddToCart = ( item: Item, player: Player, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    setError(null);
    const newAvailableMoney = availableMoney - item.value;
  
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.item._id === item._id
    );
  
    if (item.type === 'ingredient') {
      if (existingItemIndex !== -1) {
        if (availableMoney >= item.value) {
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
          setAvailableMoney(newAvailableMoney);
        } else {
          setError("You don't have enough gold to buy this item.");
        }
      } else if (availableMoney >= item.value) {
        setCartItems([...cartItems, { item, quantity: 1 }]);
        setAvailableMoney(newAvailableMoney);
      } else {
        setError("You don't have enough gold to buy this item.");
      }
    } else {
      if (existingItemIndex === -1 && !checkItemInsidePlayer(item, player)) {
        if (availableMoney >= item.value) {
          setCartItems([...cartItems, { item, quantity: 1 }]);
          setAvailableMoney(newAvailableMoney);
        } else {
          setError("You don't have enough gold to buy this item.");
        }
      } else {
        setError('Item already in inventory');
      }
    }
  };
  


  const emptyCart = () => {
    setCartItems([]);
    setAvailableMoney(player?.gold || 0);
  };

  const removeItem = (item: Item) => {
    const updatedCartItems = cartItems.filter(
      (cartItem) => cartItem.item._id !== item._id
    );

    setCartItems(updatedCartItems);
    setAvailableMoney((prev) => prev + item.value * (item.quantity || 1));
  };



  const goToCheckout = () => {
    const encodedCartItems = encodeURIComponent(JSON.stringify(cartItems));
    console.log(encodedCartItems + "un saludo master");

    router.push(`/shop/checkout?cart=${encodedCartItems}`);
  };

  const calculateTotalPrice = () =>
    cartItems.reduce((total, cartItem) => total + cartItem.item.value * cartItem.quantity, 0);


  if (!session) return null;

  const allItems: any[] = [];
  if (items.length > 0) {
    Object.entries(items[0]).forEach(([category, data]) => {
      if (Array.isArray(data)) {
        allItems.push(...data);
      }
    });
  }
  const onClose = () => {
    setShowCartModal(false);
  };

  return (
    <Layout>
      {loading && <Loading />}
      <div className="relative">
        {player && (
          <div className="absolute mt-[70%]top-4 right-4 w-auto p-2 bg-black/40 border-sepia border-2 flex items-center justify-between rounded-lg shadow">
            <div className="text-white text-3xl font-bold">Gold</div>
            <div className="flex items-center ml-2">
              <p className="text-white text-4xl font-bold">{player.gold}</p>
              <img
                src="/images/shop/gold.png"
                alt="gold coin"
                className="w-8 h-8 ml-2"
              />
            </div>
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2 z-10"
        >
          ←
        </button>
        <div className="flex">
          <div className="w-[30%] p-4 relative bg-black/60 border border-sepia text-gray-200 rounded shadow-lg">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sepia"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sepia"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sepia"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sepia"></div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowCartModal(true)}
                className="bg-transparent hover:bg-gray-600 transition flex items-center justify-center w-10 h-10 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ba9b61"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a1 1 0 0 0 .99.8h9.72a1 
                      1 0 0 0 .98-.8L23 6H6"></path>
                </svg>
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="px-4 py-1 bg-black/40 border border-sepia uppercase font-bold text-2xl tracking-wide">
                Merchant {merchantId}
              </div>
            </div>

            <div className="mb-4 flex justify-center">
              <img
                src={`/images/sellers/${merchantId}.png`}
                alt={`Merchant ${merchantId}`}
                className="object-contain h-32"
              />
            </div>

            <div className="border-t border-sepia pt-4">
              {selectedItem?.type === 'ingredient' ? (
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-center">{selectedItem.name}</h2>
                  <p className="text-3xl text-center">{selectedItem.description}</p>
                  <p className="text-3xl text-center">
                    {selectedItem.effects[0].replace(/_/g, ' ')}
                  </p>

                </div>
              ) : (
                <ItemStats
                  selectedItem={selectedItem}
                  player={player}
                />
              )}
            </div>

          </div>
          <div className="w-3/4 p-4 mt-12">
            <ItemCarousel
              items={allItems}
              player={player}
              handleBuy={handleBuy}
              handleAddToCart={handleAddToCart}
              setSelectedItem={setSelectedItem}
            />
          </div>

        </div>
      </div>
      {showCartModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end bg-black bg-opacity-50"
          onClick={() => setShowCartModal(false)}
        >
          <div
            className="bg-transparent w-full md:w-[80%] h-[100%] rounded-t-xl p-4 relative overflow-auto transform transition-transform translate-y-0"
            style={{ transition: 'transform 0.3s ease-in-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-[12%] right-[13%] text-gray-400 hover:text-gray-900 z-51"
              onClick={() => setShowCartModal(false)}
            >
              X
            </button>

            <CartPreview
              items={cartItems}
              emptyCart={emptyCart}
              removeItem={removeItem}
              calculateTotalPrice={calculateTotalPrice}
              goToCheckout={goToCheckout}
              onClose={onClose}
              handleAddToCart={handleAddToCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              player={player}
            />
          </div>
        </div>
      )}
    </Layout>

  );
};

export default MerchantPage;