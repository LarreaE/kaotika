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
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 top-[70px] space-x-5">
    <FlipCard
        name="Alaric Gemwright"
        description="Alaric Gemwright, a master jeweler of unmatched skill, crafts exquisite pieces sought after by royalty. Renowned for their intricate designs and flawless craftsmanship, his creations blend elegance, precision, and a touch of magic. Those who wear them often claim to feel imbued with grace and prestige, as if a part of Alaric’s spirit resides within his work."
        merchantId="seller1"
        profession='jeweler'
      />
      <FlipCard
        name="Eadric Steelwright"
        description="Eadric Steelwright, master armorer of the north, forges armor of unmatched strength, beauty, and endurance, crafted to withstand even the fiercest battles. Each strike of his hammer echoes like a vow of victory, resonating through the halls of his legendary forge, which glows with the unrelenting fire of legends. His creations are not just tools of war, but symbols of honor and resilience, treasured by warriors and kings alike."
        merchantId="seller2"
        profession='armorsmith'

      />
      <FlipCard
        name="Quintus Wildbrew"
        description="Quintus Wildbrew, the eccentric alchemist, is known for his chaotic experiments and an unmatched ability to concoct potions with unpredictable effects. His shop is a labyrinth of bubbling cauldrons, glowing vials, and rare ingredients, drawing curious adventurers and daring potion enthusiasts. With a mischievous grin and wild eyes, Quintus always has a “special brew” ready, though no one can predict exactly what it might do."
        merchantId="seller3"
        profession='alchemist'

      />
      <FlipCard
        name="Draven Ironvalor"
        description="Draven Ironvalor, the legendary master of shields and weapons, is a towering figure whose creations are revered by warriors and kings alike. In his blazing forge, he crafts unyielding shields that withstand the mightiest blows and blades so sharp they sing in battle. With arms like iron and a presence that commands respect, Draven’s every strike is a promise of unmatched strength. His masterpieces bear intricate carvings, telling stories of valor, and are said to carry the spirit of the forge itself, protecting those who wield them."
        merchantId="seller4"
        profession='weaponsmith'

      />
    </div>
    </Layout>
  )
}



export default Shop;
