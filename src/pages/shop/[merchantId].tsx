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

const MerchantPage = () => {

  interface Item {
    _id: number;
    name: string;
    image: string;
    value: number;
    type: string;
  }

  const { data: session, status } = useSession();
  const router = useRouter();
  const { merchantId } = router.query;

  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any>([]);
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
            `/api/player/check-registration?email=${session.user?.email}`
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

  useEffect(() => {
    if (player) {
      calculateAllAttributes(player, setCurrentAttributes);
      setAvailableMoney(player?.gold || 0);
    }
  }, [player]);

  const checkItemInsidePlayer = (item: Item, player: any): boolean => {
    const type = transformStringLowerPlural(item.type);
    if (player.inventory[type]) {
      const foundItem = player.inventory[type].find((inventoryItem: Item) => inventoryItem.name === item.name);
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

  const handleAddToCart = (item: Item, player: Player,  setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    setError(null)
    if (!checkItemInsidePlayer(item,player)) {
      if (cartItems.some((cartItem:Item) => cartItem._id === item._id)) {
        console.log('already inside');
      } else {
        if (availableMoney >= item.value) {
          console.log('Available');
          setCartItems([...cartItems, item]);
          console.log(cartItems);
          setAvailableMoney(availableMoney - item.value);
        } else {
          console.log('Unavailable');
        }
      }
    } else {
      console.log("Item already in inventory");
      setError('Item already in inventory');
    }
  };

  const emptyCart = () => {
    setCartItems([]);
    setAvailableMoney(player?.gold || 0);
  };

  const removeItem = (item: Item) => {
    if (availableMoney !== undefined) {
      setCartItems((cartItems: Item[]) => cartItems.filter((cartItem: Item) => cartItem._id !== item._id));
      setAvailableMoney(availableMoney + item.value);
    } else {
      console.log("available money undefined");
    }
  };

  const goToCheckout = () => {
    const encodedCartItems = encodeURIComponent(JSON.stringify(cartItems));
    router.push(`/shop/checkout?cart=${encodedCartItems}`);
  };

  const calculateTotalPrice = () =>
    cartItems.reduce((total: number, item: Item) => total + item.value, 0);

  if (!session) return null;

  const allItems: any[] = [];
  if (items.length > 0) {
    Object.entries(items[0]).forEach(([category, data]) => {
      if (Array.isArray(data)) {
        allItems.push(...data);
      }
    });
  }

  return (
    <Layout>
      {loading && <Loading />}
      <div className="relative">
        {/* Botón para regresar */}
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2 z-10"
        >
          ←
        </button>

        {/* Contenedor principal con la disposición del merchant */}
        <div className="flex">
          {/* Franja izquierda con estilo tipo Skyrim */}
          <div className="w-[30%] p-4 relative bg-black/60 border border-sepia text-gray-200 rounded shadow-lg">
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sepia"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sepia"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sepia"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sepia"></div>
             {/* Botón del carrito absolutamente posicionado en la esquina superior derecha */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowCartModal(true)}
            className="bg-transparent hover:bg-gray-600 transition flex items-center justify-center w-10 h-10 rounded"
          >
            <img 
              src="/images/shop/basket.png" 
              alt="Cart" 
              className="w-12 h-12 object-contain"
            />
          </button>
        </div>
            
            {/* Título del Merchant */}
            <div className="flex justify-center mb-4">
              <div className="px-4 py-1 bg-black/40 border border-sepia uppercase font-bold text-lg tracking-wide">
                Merchant {merchantId}
              </div>
            </div>
            
            <div className="mb-4 flex justify-center">
              <img
                src="/images/sellers/seller1.png"
                alt={`Merchant ${merchantId}`}
                className="object-contain h-32"
              />
            </div>
            
            <div className="border-t border-sepia pt-4">
              <ItemStats
                selectedItem={selectedItem}
                atributtes={currentAttributes}
                player={player}
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-3/4 p-4">
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

      {/* Modal del CartPreview */}
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
            {/* Botón para cerrar el modal */}
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
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MerchantPage;