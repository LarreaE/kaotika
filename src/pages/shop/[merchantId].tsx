import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { Player } from '@/_common/interfaces/Player';

import MerchantInfo from '@/components/shop/MerchantInfo';
import ItemStats from '@/components/shop/ItemStats';
import ItemCard from '@/components/shop/ItemCard';
import CartPreview from '@/components/shop/CartPreview';
import ItemCarousel from '@/components/shop/ItemCarousel';
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
  
  const [showCartModal, setShowCartModal] = useState<boolean>(false); // Estado para el modal

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
          setLoading(false); // player is slower to fetch
        }
      }
    };

    fetchShopItems();
  }, [merchantId, status, session, player]);

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

  const handleBuy = async (item: Item, player: Player) => {
    setError(null);
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

  const handleAddToCart = (item: Item, player: Player) => {
    setError(null);
    if (!checkItemInsidePlayer(item, player)) {
      if (cartItems.some((cartItem: Item) => cartItem._id === item._id)) {
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

    {/* Contenedor principal con la disposición del merchant */}
    <div className="flex">
      {/* Franja izquierda */}
      <div
        className="w-[30%] bg-orange-100 shadow-lg p-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/pergamino.jpg')",
        }}
      >
        <MerchantInfo
          merchantImage="/images/sellers/seller1.png"
          merchantName={`Merchant ${merchantId}`}
        />
        <div className="">
          <ItemStats
            selectedItem={selectedItem}
            atributtes={currentAttributes}
            player={player}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-3/4 p-4 mt-10">
        <ItemCarousel
          items={allItems}
          player={player}
          handleBuy={handleBuy}
          handleAddToCart={handleAddToCart}
          setSelectedItem={setSelectedItem}
          error={error}
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