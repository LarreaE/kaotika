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
import ItemCard from '@/components/ItenCard';
import MerchantInfo from '@/components/MerchantInfo';
import ItemStats from '@/components/ItemStats';


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
          await fetch(`/api/shop/${player.email}/${merchantId}/${item.name}`);
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

  return (
    <Layout>
      {loading && <Loading />}
      <div className="flex mt-8">
        {/* Franja izquierda */}
        <div className="w-1/4 bg-white shadow-lg p-4">
          <MerchantInfo
            merchantImage="/path-to-merchant-image.jpg"
            merchantName={`Merchant ${merchantId}`}
          />
          <div className="mt-6">
            <ItemStats selectedItem={null} />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-3/4 p-4">
          {error && <div className="text-red-600">{error}</div>}
          <h1 className="text-center text-2xl font-bold mb-4">
            Items for Merchant {merchantId}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: any, index: React.Key | null | undefined) => (
              <div
                key={index}
                onMouseEnter={() => 'setSelectedItem(item)'} // Actualiza el objeto seleccionado al hacer hover
                onMouseLeave={() => 'setSelectedItem(null)'} // Limpia al salir del hover
              >
                <ItemCard
                  item={item}
                  player={player}
                  handleBuy={() => console.log("Buy item")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MerchantPage;