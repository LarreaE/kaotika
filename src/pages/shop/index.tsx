import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { Tooltip } from '@nextui-org/react';
import FlipCard from '@/components/FlipCard';

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
        const res = await fetch('/api/player/shop');
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
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 bottom-[50px] space-x-5">
    <FlipCard
        name="Alaric Gemwright"
        description="Master jeweler of unmatched skill, crafts exquisite pieces sought after by royalty. Renowned for their intricate designs and flawless craftsmanship, his creations blend elegance, precision, and a touch of magic. Those who wear them often claim to feel imbued with grace and prestige."
        merchantId="seller1"
        profession='jeweler'
      />
      <FlipCard
        name="Eadric Steelwright"
        description="Eadric Steelwright, master armorer of the north, forges armor of unmatched strength and beauty, crafted to endure the fiercest battles. Each strike of his hammer echoes like a vow of victory, creating symbols of honor and resilience treasured by warriors and kings."
        merchantId="seller2"
        profession='armorsmith'
      />
      <FlipCard
        name="Quintus Wildbrew"
        description="Quintus Wildbrew, the eccentric alchemist, is known for his chaotic experiments and unpredictable potions. His shop, filled with bubbling cauldrons and glowing vials, attracts adventurers seeking rare ingredients and daring creations."
        merchantId="seller3"
        profession='alchemist'
      />
      <FlipCard
        name="Draven Ironvalor"
        description="Draven Ironvalor, the legendary master of shields and weapons, is revered by warriors and kings. In his blazing forge, he crafts shields and blades so sharp they sing in battle. Each strike of his hammer is a promise of strength, and his masterpieces tell stories of valor and offer unmatched protection."
        merchantId="seller4"
        profession='weaponsmith'
      />
        <FlipCard
        name="Magnus Tradebinder"
        description="Magnus Tradebinder is a shrewd merchant with a knack for collecting treasures of all kinds, from rare artifacts to everyday goods. While his shop attracts adventurers and nobles alike, Magnus is known for driving a hard bargain, often squeezing every coin he can in a deal."
        merchantId="buyer"
        profession='buyer'
      />
    </div>
    </Layout>
  )
}



export default Shop;
