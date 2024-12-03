import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Key, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import { Player } from '@/_common/interfaces/Player';
import { Task } from '@/_common/interfaces/Task';
import KaotikaButton from '@/components/KaotikaButton';


const MerchantPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { merchantId } = router.query;
   
    const [items, setItems] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [player, setPlayer] = useState<Player>();
    const [error, setError] = useState<string | null>(null);

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

  const handleBuy = async(item:any, player:any) => {
    console.log(item);
    if (player.gold >= item.value) {
      console.log("Available");
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
        setError('An error occurred with the purchase');
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Unavaliable");

    }
  }

  if (!session) return null;

  if (error) return <div className="text-4xl text-center">{error}</div>;

  if (items) {
    return (
      <Layout>
        {loading && <Loading />}
        <div className="mt-8 text-center">
          <div className="fixed top-32 right-4 bg-white shadow-lg p-4 rounded-md border">
            <h2 className="text-xl font-semibold">Balance</h2>
            <div className="text-lg text-green-600">
              ${player?.gold}
            </div>
          </div>

          <h1>Data for {merchantId}</h1>

          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(items[0]).map(([category, data]) => {
                if (!Array.isArray(data)) return null;

                return (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.map((item: any, index: React.Key | null | undefined) => (
                        <div
                          key={index}
                          className="border rounded-lg shadow-md p-4 flex flex-col items-center"
                        >
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name || "Unnamed Item"}
                            className="w-full h-40 object-cover rounded-md mb-4"
                          />
                          <strong className="text-lg mb-2">{item.name || "Unnamed Item"}</strong>
                          <div className="text-red-700">Price: ${item.value || "N/A"}</div>
                          <div className="text-sm text-gray-500 my-2">
                            {item.description || "No description available"}
                          </div>
                          <button
                            className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => handleBuy(item, player)}
                          >
                            Buy Now
                          </button>
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
      </Layout>
    );
    }  
};

export default MerchantPage;