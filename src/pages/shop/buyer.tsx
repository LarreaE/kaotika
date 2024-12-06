// src/pages/shop/[merchantId].tsx

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { Player } from '@/_common/interfaces/Player';

import MerchantInfo from '@/components/shop/MerchantInfo';
import ItemStats from '@/components/shop/ItemStats';
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

const MerchantPage: React.FC = () => {

  interface item {
    _id: string,
    name: string,
    image: string,
    value: number,
    type: string,
    description: string,
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
      console.log('Available');
      try {
        setLoading(true);
        const encodedItem = encodeURIComponent(JSON.stringify(item));

        const res = await fetch(
          `/api/shop/sell/${player?.email}/${encodedItem}`
        );
        if (res.status === 200) {
          const response = await res.json();
          console.log(response);
          setPlayer(response);
        } else if (res.status === 404) {
          console.log(error);
        } else {
          setError('An error occurred while checking registration');
        }
      } catch (error) {
        console.error('Failed to complete sell:', error);
        setError('Failed to sell');
      } finally {
        setLoading(false);
        setSelectedItem(null);
      }
  };

  const selectItem = (item: item) => {
    console.log(item);
    setSelectedItem(item);
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
      {loading && <Loading/>}
  <div className="bg-[url('/images/shop/shop_background.png')] bg-cover bg-center bg-opacity-90 min-h-screen flex flex-row">
    <div className="w-3/12 p-4 bg-black bg-opacity-70 flex flex-col items-center">
    <div 
          style={{
            backgroundImage: "url('/images/pergamino.jpg')",
          }}
        >
          <MerchantInfo
            merchantImage="/images/sellers/seller1.png"
            merchantName={`Merchant ${merchantId}`}
          />
          <div className="">
            <ItemStats className="rounded-3xl"
              selectedItem={selectedItem}
              atributtes={currentAttributes}
              player={player}
            />
          </div>
        </div>
    </div>
    {selectedItem ? (
      <div className="w-5/12 bg-red-900 bg-opacity-10 flex flex-col items-center rounded-3xl shadow-lg">
        <div className="w-3/5 h-4/6 p-4 bg-black bg-opacity-70 flex flex-col items-center rounded-2xl shadow-lg border-4 border-sepia">
          <div className="w-full text-center bg-medievalSepia py-2 rounded-t-2xl">
            <p className="text-black text-4xl font-bold">
              {selectedItem?.name || 'Sellect any item'}
            </p>
          </div>
          <div className="w-3/5 mt-4 border-4 border-sepia rounded-xl overflow-hidden shadow-md bg-white">
            {selectedItem?.image ? (
              <img
                src={selectedItem.image}
                alt={selectedItem.name || 'Selected Item'}
                className="w-full h-auto"
              />
            ) : (
              <p className="text-gray-500 text-center p-4">
                Any item selected
              </p>
            )}
          </div>
          <div className="w-full mt-4 text-center">
            <p className="text-white text-3xl font-medium">
              {selectedItem?.description || 'Without description'}
            </p>
          </div>
          {selectedItem && (
            <div className="w-auto -bottom-12 mt-auto text-center bg-medievalSepia py-1 px-2 rounded-2xl flex flex-row items-center justify-center relative">
              <p className="text-black text-4xl font-bold mr-2">{selectedItem.value}</p>
              <img
                src="/images/shop/gold.png"
                alt="gold coin"
                className="w-12 h-12 ml-2"
              />
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-center gap-x-4 mt-16">
          <button 
            className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
            View details
          </button>
          {selectedItem && (
            <button 
              onClick={() => handleSell(selectedItem)}
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
            {player &&  <div className="grid grid-cols-8 grid-rows-8 flex-grow">
                {player?.inventory.helmets.map(helmet => {
                    return (
                    <div onClick={() => selectItem(helmet)} key={helmet._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={10}  type='inventory' children={<Draggable id={helmet._id} tooltip={<DefenseTooltip element={helmet} equiped={player.equipment.helmet}/>} position='bottom' type={[`${helmet.min_lvl <= player.level ? helmet.type : null}`, 'inventory']} element={helmet} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.weapons.map(weapon => {
                    return (
                    <div onClick={() => selectItem(weapon)} key={weapon._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={20}  type='inventory' children={<Draggable id={weapon._id} tooltip={<WeaponTooltip element={weapon} equiped={player?.equipment.weapon}/>} position='bottom' type={[`${weapon.min_lvl <= player?.level ? weapon.type : null}`, 'inventory']} element={weapon} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.armors.map(armor => {
                    return (
                    <div onClick={() => selectItem(armor)} key={armor._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>    
                        <Droppable id={30}  type='inventory' children={<Draggable id={armor._id} tooltip={<DefenseTooltip element={armor} equiped={player?.equipment.armor}/>} position='bottom' type={[`${armor.min_lvl <= player?.level ? armor.type : null}`, 'inventory']} element={armor} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>                      
                    </div>
                    )
                })
                }
                {
                player?.inventory.shields.map(shield => {
                    return (
                    <div onClick={() => selectItem(shield)} key={shield._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={40}  type='inventory' children={<Draggable id={shield._id} tooltip={<DefenseTooltip element={shield} equiped={player?.equipment.shield}/>} position='bottom' type={[`${shield.min_lvl <= player?.level ? shield.type : null}`, 'inventory']} element={shield} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.artifacts.map(artifact => {
                    return (
                    <div onClick={() => selectItem(artifact)} key={artifact._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={50}  type='inventory' children={<Draggable id={artifact._id} tooltip={<CommonTooltip element={artifact} equiped={player?.equipment.artifact}/>} position='bottom' type={[`${artifact.min_lvl <= player?.level ? artifact.type : null}`, 'inventory']} element={artifact} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.boots.map(boot => {
                    return (
                    <div onClick={() => selectItem(boot)} key={boot._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={1}  type='inventory' children={<Draggable id={boot._id} tooltip={<DefenseTooltip element={boot} equiped={player?.equipment.boot}/>} position='bottom' type={[`${boot.min_lvl <= player?.level ? boot.type : null}`, 'inventory']} element={boot} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.rings.map(ring => {
                    return (
                    <div onClick={() => selectItem(ring)} key={ring._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={1}  type='inventory' children={<Draggable id={ring._id} tooltip={<CommonTooltip element={ring} equiped={player?.equipment.ring}/>} position='bottom' type={[`${ring.min_lvl <= player?.level ? ring.type : null}`, 'inventory']} element={ring} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.healing_potions.map(healing => {
                    return (
                    <div key={healing._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={1}  type='inventory' children={<Draggable id={healing._id} tooltip={<HealingPotionTooltip element={healing} equiped={player?.equipment.healing_potion}/>} position='bottom' type={[`${healing.type}`, 'inventory']} element={healing} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.antidote_potions.map(antidote => {
                    return (
                    <div key={antidote._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={1}  type='inventory' children={<Draggable id={antidote._id} tooltip={<AntidotePotionTooltip element={antidote} equiped={player?.equipment.antidote_potion}/>} position='bottom' type={[`${antidote.type}`, 'inventory']} element={antidote} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                    </div>
                    )
                })
                }
                {
                player?.inventory.enhancer_potions.map(enhancer => {
                    return (
                    <div key={enhancer._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                        <Droppable id={1}  type='inventory' children={<Draggable id={enhancer._id} tooltip={<EnhancerPotionTooltip element={enhancer} equiped={player?.equipment.enhancer_potion}/>} position='bottom' type={[`${enhancer.type}`, 'inventory']} element={enhancer} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
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