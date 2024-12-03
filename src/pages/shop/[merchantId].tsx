import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import MerchantInfo from '@/components/MerchantInfo';
import ItemStats from '@/components/ItemStats';
import ItemCard from '@/components/ItemCard';

const MerchantPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { merchantId } = router.query;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // Estado para el objeto seleccionado

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
            const res = await fetch(`/api/player/check-registration?email=${session.user?.email}`);
            if (res.status === 200) {
              const response = await res.json();
              console.log(response.data)
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

  const handleBuy = async (item: any, player: any) => {
    if (player?.gold >= item.value) {
      try {
        setLoading(true);

        if (player.gold >= item.value ) {
          const res = await fetch(`/api/shop/${player.email}/${merchantId}/${item.name}`);
          if (res.status === 200) {
            const response = await res.json();
            console.log(response)
            setPlayer(response);
          } else if (res.status === 404) {
            console.log(error);
          } else {
            setError('An error occurred while checking registration');
          }
        }

        
      } catch (error) {
        console.error('Failed to complete purchase:', error);
        setError('Failed to complete purchase');
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Not enough gold.");
    }
  };

  if (!session) return null;

  return (
    <Layout>
      {loading && <Loading />}
      <div className="flex mt-8">
        {/* Franja izquierda */}
        <div className="w-1/4 bg-orange-100 shadow-lg p-4">
          <MerchantInfo
            merchantImage='/sellers/seller1.png'
            merchantName={`Merchant ${merchantId}`}
          />
          <div className="mt-6">
            <ItemStats selectedItem={selectedItem} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-3/4 p-4">
          {error && <div className="text-red-600">{error}</div>}
          <div className="fixed top-32 right-4 bg-white shadow-lg p-4 rounded-md border">
            <h2 className="text-xl font-semibold">Balance</h2>
            <div className="text-lg text-green-600">${player?.gold || 0}</div>
          </div>
          <h1 className="text-center text-2xl font-bold mb-4">
            Items for Merchant {merchantId}
          </h1>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(items[0]).map(([category, data]) => {
                if (!Array.isArray(data)) return null;

                return (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.map((item: any, index: React.Key | null | undefined) => (
                        <div
                          key={index}
                          onMouseEnter={() => setSelectedItem(item)} // Actualiza el objeto seleccionado al hacer hover
                        >
                          <ItemCard
                            item={item}
                            player={player}
                            handleBuy={() => handleBuy(item, player)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No items available for this merchant.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MerchantPage;