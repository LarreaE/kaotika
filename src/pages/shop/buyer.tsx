// src/pages/shop/[merchantId].tsx

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { Player } from '@/_common/interfaces/Player';

import MerchantInfo from '@/components/shop/MerchantInfo';
import ItemStats from '@/components/shop/ItemStats';
import ItemBaseStats from '@/components/shop/ItemBaseStats';
import ItemCard from '@/components/shop/ItemCard';
import ItemDisplay from '@/components/shop/ItemDisplay';
import ItemCarousel from '@/components/shop/ItemCarousel'; // Importa el nuevo componente
import { calculateAllAttributes } from '@/helpers/PlayerAttributes';
import { Modifier } from '@/_common/interfaces/Modifier';
import Droppable from '@/components/Droppable';
import Draggable from '@/components/Draggable';
import DefenseTooltip from '@/components/tooltips/DefenseTooltip';
import WeaponTooltip from '@/components/tooltips/WeaponTooltip';
import CommonTooltip from '@/components/tooltips/CommonTooltip';
import HealingPotionTooltip from '@/components/tooltips/HealingPotionTooltip';
import AntidotePotionTooltip from '@/components/tooltips/AntidotePotionTooltip';
import EnhancerPotionTooltip from '@/components/tooltips/EnhancerPotionTooltip';
import { GRID_NUMBER } from '@/constants/constants';
import SellItemCard from '@/components/shop/SellItemCard';
import SellConfirmationModal from '@/components/shop/SellConfirmationModal';
import SellItemDetailModal from '@/components/shop/SellItemDetailModal';

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
    {player &&  <div className="grid grid-cols-8 grid-rows-8" style={{ width: 'fit-content', height: 'fit-content' }}>
        {player?.inventory.helmets.map(helmet => {
            return (
            <div onClick={() => selectItem(helmet)} key={helmet._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={10}  type='inventory' children={<Draggable id={helmet._id} position='bottom' type={[`${helmet.min_lvl <= player.level ? helmet.type : null}`, 'inventory']} element={helmet} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.weapons.map(weapon => {
            return (
            <div onClick={() => selectItem(weapon)} key={weapon._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={20}  type='inventory' children={<Draggable id={weapon._id} position='bottom' type={[`${weapon.min_lvl <= player?.level ? weapon.type : null}`, 'inventory']} element={weapon} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.armors.map(armor => {
            return (
            <div onClick={() => selectItem(armor)} key={armor._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>    
                <Droppable id={30}  type='inventory' children={<Draggable id={armor._id} position='bottom' type={[`${armor.min_lvl <= player?.level ? armor.type : null}`, 'inventory']} element={armor} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>                      
            </div>
            )
        })
        }
        {
        player?.inventory.shields.map(shield => {
            return (
            <div onClick={() => selectItem(shield)} key={shield._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={40}  type='inventory' children={<Draggable id={shield._id} position='bottom' type={[`${shield.min_lvl <= player?.level ? shield.type : null}`, 'inventory']} element={shield} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.artifacts.map(artifact => {
            return (
            <div onClick={() => selectItem(artifact)} key={artifact._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={50}  type='inventory' children={<Draggable id={artifact._id} position='bottom' type={[`${artifact.min_lvl <= player?.level ? artifact.type : null}`, 'inventory']} element={artifact} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.boots.map(boot => {
            return (
            <div onClick={() => selectItem(boot)} key={boot._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={boot._id} position='bottom' type={[`${boot.min_lvl <= player?.level ? boot.type : null}`, 'inventory']} element={boot} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.rings.map(ring => {
            return (
            <div onClick={() => selectItem(ring)} key={ring._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={ring._id} position='bottom' type={[`${ring.min_lvl <= player?.level ? ring.type : null}`, 'inventory']} element={ring} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.healing_potions.map(healing => {
            return (
            <div key={healing._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={healing._id} position='bottom' type={[`${healing.type}`, 'inventory']} element={healing} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.antidote_potions.map(antidote => {
            return (
            <div key={antidote._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={antidote._id} position='bottom' type={[`${antidote.type}`, 'inventory']} element={antidote} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.enhancer_potions.map(enhancer => {
            return (
            <div key={enhancer._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={enhancer._id} position='bottom' type={[`${enhancer.type}`, 'inventory']} element={enhancer} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        { 
        Array.from({
            length:
            GRID_NUMBER 
            - player.inventory.helmets.length 
            - player.inventory.weapons.length 
            - player.inventory.armors.length 
            - player.inventory.shields.length
            - player.inventory.artifacts.length
            - player.inventory.boots.length
            - player.inventory.rings.length
            - player.inventory.healing_potions.length
            - player.inventory.antidote_potions.length
            - player.inventory.enhancer_potions.length
        }).map((element,index) => <div key={index} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}><Droppable id={23} type='inventory'  children={null}/></div> ) 
        }                      
        </div>
      }
    </div>
  </div>
</Layout>

  );
};

export default MerchantPage;