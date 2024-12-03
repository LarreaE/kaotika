import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import Cart from '@/components/shop/Cart';
const Checkout = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    { id: 1, name: "Kaotikal Sword", type: "medieval", quantity: 1, price: 2500 },
    { id: 2, name: "Elixir of the Traitor", type: "ingredient", quantity: 3, price: 53},
    { id: 3, name: "Shadows Shield", type: "medieval", quantity: 1, price: 1500 },
  ]);

  console.log(items);
  
  useEffect(() => {

  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <Layout>
    <Cart Items={items}
    />
    </Layout>
  )
}



export default Checkout;