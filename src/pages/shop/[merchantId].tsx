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
          setLoading(false);
        }
      };
    
      fetchShopItems();
    }, [merchantId]);
    
  const handleBuy = (item:any) => {
    
  }

  if (!session) return null;

  if (items) {
    return (
      <Layout>
        {loading && <Loading />}
        <div className="mt-8 text-center">
          <h1>Data for {merchantId}</h1>
          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: any, index: React.Key | null | undefined) => (
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
                  <div className="text-gray-700">Price: ${item.value || "N/A"}</div>
                  <div className="text-sm text-gray-500 my-2">
                    {item.description || "No description available"}
                  </div>
                  <button
                    className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleBuy(item)}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
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