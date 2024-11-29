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
    if (status === 'loading') return;
    if (!session) {
      router.push('/'); 
      return;
    }

    const fetchShopItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shop/merchants/${merchantId}`)        
        const itemsData = await response.json();
        console.log(itemsData);
        
        setItems(itemsData)
      } catch (error) {
        console.error('Failed to fetch merchant items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, [session, status, router]);


  if (!session) return null;

  if (items) {
    return (
      <Layout>
        {(loading) ? <Loading /> : null}
        <div className="mt-8 text-center">
        <h1>Data for {merchantId}</h1>
        {items.map((item: any, index: Key | null | undefined) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
        </div>
      </Layout>
    );
  }
  
};

export default MerchantPage;