// src/pages/shop/[merchantId].tsx

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { Player } from '@/_common/interfaces/Player';

import MerchantInfo from '@/components/shop/MerchantInfo';
import ItemStats from '@/components/shop/ItemStats';
import ItemCard from '@/components/shop/ItemCard';
import ItemDisplay from '@/components/shop/ItemDisplay';
import ItemCarousel from '@/components/shop/ItemCarousel'; // Importa el nuevo componente
import { calculateAllAttributes } from '@/helpers/PlayerAttributes';
import { Modifier } from '@/_common/interfaces/Modifier';

const MerchantPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { merchantId } = router.query;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [currentAttributes, setCurrentAttributes] = useState<Modifier>();

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
            console.log(response.data);
            setPlayer(response.data);
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

  const handleBuy = async (item: any, player: any) => {
    console.log(item);
    if (player.gold >= item.value) {
      console.log('Available');
      try {
        setLoading(true);

        const res = await fetch(
          `/api/shop/${player.email}/${merchantId}/${item.name}`
        );
        if (res.status === 200) {
          const response = await res.json();
          console.log(response);
          setPlayer(response);
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
      console.log('Unavailable');
    }
  };

  const handleAddToCart = (item: any, player: any) => {
    if (cartItems.some((cartItem) => cartItem._id === item._id)) {
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
  };

  const emptyCart = () => {
    setCartItems([]);
    setAvailableMoney(player?.gold || 0);
  };

  const removeItem = (item: any) => {
    setCartItems((cartItems) =>
      cartItems.filter((cartItem) => cartItem._id !== item._id)
    );
    setAvailableMoney((prev) => prev + item.value);
  };

  const calculateTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.value, 0);

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
              playerLevel={player?.level}
            />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-3/4 p-4">
          {error && <div className="text-red-600">{error}</div>}

          {/* Usamos el nuevo componente ItemCarousel */}
          <ItemCarousel
            items={allItems}
            player={player}
            handleBuy={handleBuy}
            handleAddToCart={handleAddToCart}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </div>
      <ItemDisplay
        items={cartItems}
        emptyCart={emptyCart}
        removeItem={removeItem}
        calculateTotalPrice={calculateTotalPrice}
      />
    </Layout>
  );
};

export default MerchantPage;