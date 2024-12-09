// src/pages/shop/[merchantId].tsx

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { Player } from '@/_common/interfaces/Player';
import MerchantInfo from '@/components/shop/MerchantInfo';
import ItemStats from '@/components/shop/ItemStats';
import { calculateAllAttributes } from '@/helpers/PlayerAttributes';
import { Modifier } from '@/_common/interfaces/Modifier';
import SellItemCard from '@/components/shop/SellItemCard';
import SellConfirmationModal from '@/components/shop/SellConfirmationModal';
import SellItemDetailModal from '@/components/shop/SellItemDetailModal';
import SellInventory from '@/components/shop/SellInventory';

const MerchantPage: React.FC = () => {

  interface Item {
    _id: string;
    name: string;
    image: string;
    value: number;
    type: string;
    description: string;
    stats?: {
      intelligence?: number;
      dexterity?: number;
      constitution?: number;
      insanity?: number;
      charisma?: number;
      strength?: number;
    };
  }
  

  const { data: session, status } = useSession();
  const router = useRouter();
  const { merchantId } = router.query;

  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState<string | null>(null);
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<item | null>(null);
  const [currentAttributes, setCurrentAttributes] = useState<Modifier>();

  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [confirmationDetails, setConfirmationDetails] = useState<{ currentGold: number; newGold: number; item: item | null } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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


  const handleSell = async (item: item) => {
    if (!item || !player) return;

    try {
        setLoading(true);
        const encodedItem = encodeURIComponent(JSON.stringify(item));
        const res = await fetch(`/api/shop/sell/${player?.email}/${encodedItem}`);

        if (res.status === 200) {
            const response = await res.json();
            setPlayer(response); // Actualiza los datos del jugador
            setAvailableMoney(response.gold); // Actualiza el oro disponible
            setSelectedItem(null); // Deselecciona el objeto vendido
        } else {
            setError('Failed to sell');
        }
    } catch (error) {
        console.error('Failed to complete sell:', error);
        setError('Failed to sell');
    } finally {
        setLoading(false);
        setIsConfirming(false);
        setConfirmationDetails(null);
    }
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };


  const selectItem = (item: item) => {
    console.log(item);
    setSelectedItem(item);
  };

  const initiateSell = (item: item) => {
    if (!player) return;
    const sellValue = Math.floor(item.value / 3);
    setConfirmationDetails({
        currentGold: player.gold,
        newGold: player.gold + sellValue,
        item,
    });
    setIsConfirming(true);
  };


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
    {isModalOpen && selectedItem && (
      <SellItemDetailModal
        selectedItem={selectedItem}
        currentAttributes={currentAttributes}
        player={player}
        closeModal={closeModal}
        initiateSell={initiateSell}
      />
    )}
    {isConfirming && (
      <SellConfirmationModal
        confirmationDetails={confirmationDetails}
        handleSell={handleSell}
        setIsConfirming={setIsConfirming}
      />
    )}

  {loading && <Loading />}
  <div className="bg-[url('/images/shop/shop_background.png')] bg-cover bg-center bg-opacity-90 min-h-screen flex flex-row">
    <div className="w-3/12 bg-black bg-opacity-70 flex flex-col items-center">
      <div  
        className="w-full h-full p-4 bg-black bg-opacity-70 flex flex-col items-center"
        style={{
          backgroundImage: "url('/images/pergamino.jpg')", 
        }}
      >
        <div className="h-2/6">
          <MerchantInfo
            merchantImage="/images/sellers/seller1.png"
            merchantName={`Merchant ${merchantId}`}
          />
        </div>
        <div className="h-[3/6] w-full pt-[5%]">
          <ItemStats
            className="rounded-3xl"
            selectedItem={selectedItem}
            atributtes={currentAttributes}
            player={player}
          />
        </div>
      </div>
    </div>
    {selectedItem ? (
      <div className="w-5/12 bg-red-900 bg-opacity-10 flex flex-col items-center rounded-3xl shadow-lg">
        <SellItemCard selectedItem={selectedItem} />
        <div className="flex flex-row items-center justify-center gap-x-4 mt-16">
          <button
            onClick={handleViewDetails}
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
            View details
          </button>
          {selectedItem && (
            <button 
              onClick={() => initiateSell(selectedItem)}
              className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
              Sell for {Math.floor(selectedItem.value / 3)}
            </button>
        
          )}
        </div>
      </div>
    ) : (
      <div className="w-5/12 bg-red-900 bg-opacity-10 flex flex-col items-center rounded-3xl shadow-lg">

      </div>
    )}
    <div className="w-4/12 bg-black bg-opacity-70 flex flex-col items-center rounded-3xl shadow-lg">
      {player && (
        <div className="w-2/5 h-auto p-2 bg-medievalSepia flex items-center justify-between rounded-2xl shadow-lg mb-4 self-end mr-4">
          <div className="text-black text-2xl font-bold">Gold</div>
          <div className="flex items-center">
            <p className="text-black text-3xl font-bold">{player.gold}</p>
            <img
              src="/images/shop/gold.png"
              alt="gold coin"
              className="w-8 h-8 ml-2"
            />
          </div>
        </div>
      )}
      {player &&  
        <SellInventory
          player={player}
          GRID_NUMBER={64}
          selectItem={selectItem}
        />
      }
    </div>
  </div>
</Layout>

  );
};

export default MerchantPage;