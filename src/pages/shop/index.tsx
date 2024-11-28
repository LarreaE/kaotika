import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { Tooltip } from '@nextui-org/react';

const Shop = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("useEffect Fetching Aivan's Shop");
    if (!session) return;
    const fetchHallOfFame = async () => {
      try {
        setLoading(true);
        console.log("Fetching Aivan's shop");
        const res = await fetch('/api/player/shop/');
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Failed to Aivan's Shop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHallOfFame();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <Layout>
        <>
            <div>Welcome to the shop</div>
        </>
    </Layout>
  )
}



export default Shop;
