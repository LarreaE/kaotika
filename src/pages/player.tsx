import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Progress, Tooltip, User } from "@nextui-org/react";
import {DndContext, DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import { Toaster, toast } from 'sonner'
import useSound from 'use-sound';
import _ from 'lodash';
import Loading from '@/components/Loading';
import Layout from '@/components/Layout';
import KaotikaNextButton from '@/components/KaotikaNextButton';
import { Profile } from '@/_common/interfaces/Profile';
import { Player } from '@/_common/interfaces/Player';
import Droppable from '@/components/Droppable';
import Draggable from '@/components/Draggable';
import AttributeTooltip from '@/components/tooltips/AttributeTooltip';
import EnhancerPotionTooltip from '@/components/tooltips/EnhancerPotionTooltip';
import DefenseTooltip from '@/components/tooltips/DefenseTooltip';
import WeaponTooltip from '@/components/tooltips/WeaponTooltip';
import CommonTooltip from '@/components/tooltips/CommonTooltip';
import HealingPotionTooltip from '@/components/tooltips/HealingPotionTooltip';
import AntidotePotionTooltip from '@/components/tooltips/AntidotePotionTooltip';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Weapon } from '@/_common/interfaces/Weapon';
import { Armor } from '@/_common/interfaces/Armor';
import { Shield } from '@/_common/interfaces/Shield';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Boot } from '@/_common/interfaces/Boot';
import { Ring } from '@/_common/interfaces/Ring';
import { HealingPotion } from '@/_common/interfaces/HealingPotion';
import { AntidotePotion } from '@/_common/interfaces/AntidotePotion';
import { EnhancerPotion } from '@/_common/interfaces/EnhancerPotion';
import { Modifier } from '@/_common/interfaces/Modifier';
import KaotikaButton from '@/components/KaotikaButton';
import {GRID_NUMBER, EXP_POINTS, PROGRESS_LABEL, PROGRESS_VALUE} from '../constants/constants';
import ProgressBar from '@/components/ProgressBar';
import { calculateAllAttributes } from '@/helpers/PlayerAttributes';
import { calculateHitPoints } from '@/helpers/calculateHitPoints';
import { calculateAttack } from '@/helpers/calculateAttack';
import { calculateDefense } from '@/helpers/calculateDefense';
import { calculateMagicResistance } from '@/helpers/calculateMagicResistance';
import { calculateCFP } from '@/helpers/calculateCFP';
import { calculateBCFA } from '@/helpers/calculateBCFA';

const mountedStyle = { animation: "inAnimation 250ms ease-in" };
const unmountedStyle = {animation: "outAnimation 270ms ease-out"};

const PlayerPage = () => {

  const router = useRouter();
  const { data: session } = useSession();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [player, setPlayer] = useState<Player>();
  const [currentEquipment, setCurrentEquipment] = useState({});
  const [currentAttributes, setCurrentAttributes] = useState<Modifier>();
  const [hitPoints, setHitPoints] = useState(0);
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [magicResistance, setmagicResistance] = useState(0);
  const [cfp, setCFP] = useState(0);
  const [bcfa, setBCFA] = useState(0);
  const [warningVisible, setWarningVisible] = useState(false);
  const [playHelmet] = useSound('/sounds/helmet.mp3');
  const [playWeapon] = useSound('/sounds/sword.mp3');
  const [playArmor] = useSound('/sounds/armor.mp3');
  const [playShield] = useSound('/sounds/shield.mp3');
  const [playArtifact] = useSound('/sounds/artifact.mp3');
  const [playBoot] = useSound('/sounds/boot.mp3');
  const [playRing] = useSound('/sounds/ring.mp3');
  const [playPotion] = useSound('/sounds/potion.mp3');
  const [playInsufficientLevel] = useSound('sounds/level.mp3');
  
  useEffect(() => {
    if (session?.user?.email) {
      const fetchPlayerData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/player/check-registration?email=${session.user?.email}`);
          if (res.status === 200) {
            const response = await res.json();            
            setCurrentEquipment(response.equipment);
            console.log(response)
            setPlayer(response);
            setIsRegistered(true);
          } else if (res.status === 404) {
            const response = await res.json();
            setIsRegistered(false);
            setProfiles(response.profiles);
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
    if(player) calculateAllAttributes(player, setCurrentAttributes);
  }, [player]);

  useEffect(() => {
    recalculateStats();
    handleEquipmentWarning();
  }, [currentAttributes, currentEquipment, player?.equipment])

  const handleEquipmentWarning = () => {
    if(!_.isEqual(currentEquipment, player?.equipment)) {
      setWarningVisible(true);
    } else {
      setWarningVisible(false);
    }
  }

  const recalculateStats = () => {
    handleHitPointsCalculation();
    handleAttackCalculation();
    handleDefenseCalculation();
    handleMagicResistanceCalculation();
    handleCFPCalculation();
    handleBCFACalculation();
  }

  const handleHitPointsCalculation = (): void => {
    if(!currentAttributes) return;
    const newHitPoints =  calculateHitPoints(currentAttributes);
    setHitPoints(newHitPoints);
  }
  const handleAttackCalculation = (): void => {
    if(!currentAttributes) return;
    const newAttack =  calculateAttack(currentAttributes);
    setAttack(newAttack);
  }

  const handleDefenseCalculation = (): void => {
    if(!currentAttributes) return;
    const newDefense = calculateDefense(currentAttributes);
    setDefense(newDefense);
  }

  const handleMagicResistanceCalculation = (): void => {
    if(!currentAttributes) return;
    const newMagicResistance = calculateMagicResistance(currentAttributes);
    setmagicResistance(newMagicResistance);
  }

  const handleCFPCalculation = (): void => {
    if(!currentAttributes) return;
    const CFP = calculateCFP(currentAttributes);
    setCFP(CFP);
  }

  const handleBCFACalculation = (): void => {
    if(!currentAttributes) return;
    const BCFA = calculateBCFA(currentAttributes);
    setBCFA(BCFA);
  }

  const handleSelectedOption = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    const profile = profiles.find((obj) => obj._id === selectedOption);
    setCurrentProfile(profile as Profile);
  }

  const handleNext = () => {
    const createQueryString = (name: string, value: Profile) => {
      const params = new URLSearchParams();
      params.set(name, JSON.stringify(value));
      return params.toString();
    };
    router.push(`/equipment?${createQueryString("profile", currentProfile as Profile)}`);
  };

  const updatePlayerEquipment = async() => {
    try {
      setLoading(true);
      console.log("updatePlayerEquipment player");
      const response = await fetch(`/api/player/equipment?id=${player?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          inventory: player?.inventory,
          equipment:  player?.equipment      
        }),
      });
      const results = await response.json();
      setCurrentEquipment(results.data.equipment);
      setPlayer(results.data);
    } catch (error) {
      console.error('Failed to patch player equipment:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDragStart = (event:DragStartEvent) => {
    if (event.active.data.current?.supports[0] === 'null') {
      playInsufficientLevel();
      toast('Insufficient level little acolyte !!');
    };
    
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (over && active.data.current?.supports.includes(over.data.current?.type)) {
      
      if(over.data.current?.type === 'helmet') {
        const helmet = player?.inventory.helmets.find(helmet => helmet._id === active.id);
        const currentHelmetEquiped = player?.equipment.helmet;
        const helmetsOnInventory: Helmet[] = player?.inventory?.helmets?.filter(helmet => helmet._id !== active.id) || [];
        helmetsOnInventory?.push(currentHelmetEquiped!);
        if(helmet !== undefined && player?.equipment.weapon !== undefined) {
          playHelmet();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              helmet: helmet ? helmet:helmet
            },
            inventory: {
              ...player.inventory,
              helmets: helmetsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'weapon') {
        const weapon = player?.inventory.weapons.find(weapon => weapon._id === active.id);
        const currentWeaponEquiped = player?.equipment.weapon;
        const weaponsOnInventory: Weapon[] = player?.inventory?.weapons?.filter(weapon => weapon._id !== active.id) || [];
        weaponsOnInventory?.push(currentWeaponEquiped!);
        if(weapon !== undefined && player?.equipment.helmet !== undefined) {
          playWeapon();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              weapon: weapon
            },
            inventory: {
              ...player.inventory,
              weapons: weaponsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'armor') {
        const armor = player?.inventory.armors.find(armor => armor._id === active.id);
        const currentArmorEquiped = player?.equipment.armor;
        const armorsOnInventory: Armor[] = player?.inventory?.armors?.filter(armor => armor._id !== active.id) || [];
        armorsOnInventory?.push(currentArmorEquiped!);
        if(armor !== undefined && player?.equipment.helmet !== undefined) {
          playArmor();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              armor: armor
            },
            inventory: {
              ...player.inventory,
              armors: armorsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'shield') {
        const shield = player?.inventory.shields.find(shield => shield._id === active.id);
        const currentShieldEquiped = player?.equipment.shield;
        const shieldsOnInventory: Shield[] = player?.inventory?.shields?.filter(shield => shield._id !== active.id) || [];
        shieldsOnInventory?.push(currentShieldEquiped!);
        if(shield !== undefined && player?.equipment.helmet !== undefined) {
          playShield();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              shield: shield
            },
            inventory: {
              ...player.inventory,
              shields: shieldsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'artifact') {
        const artifact = player?.inventory.artifacts.find(artifact => artifact._id === active.id);
        const currentArtifactEquiped = player?.equipment.artifact;
        const artifactsOnInventory: Artifact[] = player?.inventory?.artifacts?.filter(artifact => artifact._id !== active.id) || [];
        artifactsOnInventory?.push(currentArtifactEquiped!);
        if(artifact !== undefined && player?.equipment.helmet !== undefined) {
          playArtifact();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              artifact: artifact
            },
            inventory: {
              ...player.inventory,
              artifacts: artifactsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'boot') {
        const boot = player?.inventory.boots.find(boot => boot._id === active.id);
        const currentBootEquiped = player?.equipment.boot;
        const bootsOnInventory: Boot[] = player?.inventory?.boots?.filter(boot => boot._id !== active.id) || [];
        bootsOnInventory?.push(currentBootEquiped!);
        if(boot !== undefined && player?.equipment.helmet !== undefined) {
          playBoot();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              boot: boot
            },
            inventory: {
              ...player.inventory,
              boots: bootsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'ring') {
        const ring = player?.inventory.rings.find(ring => ring._id === active.id);
        const currentRingEquiped = player?.equipment.ring;
        const ringsOnInventory: Ring[] = player?.inventory?.rings?.filter(ring => ring._id !== active.id) || [];
        ringsOnInventory?.push(currentRingEquiped!);
        if(ring !== undefined && player?.equipment.helmet !== undefined) {
          playRing();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              ring: ring
            },
            inventory: {
              ...player.inventory,
              rings: ringsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'healing') {
        const healing = player?.inventory.healing_potions.find(healing => healing._id === active.id);
        const currentHealingEquiped = player?.equipment.healing_potion;
        const healingsOnInventory: HealingPotion[] = player?.inventory?.healing_potions?.filter(healing => healing._id !== active.id) || [];
        healingsOnInventory?.push(currentHealingEquiped!);
        if(healing !== undefined && player?.equipment.helmet !== undefined) {
          playPotion();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              healing_potion: healing
            },
            inventory: {
              ...player.inventory,
              healing_potions: healingsOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'antidote') {
        const antidote = player?.inventory.antidote_potions.find(antidote => antidote._id === active.id);
        const currentAntidoteEquiped = player?.equipment.antidote_potion;
        const antidotesOnInventory: AntidotePotion[] = player?.inventory?.antidote_potions?.filter(antidote => antidote._id !== active.id) || [];
        antidotesOnInventory?.push(currentAntidoteEquiped!);
        if(antidote !== undefined && player?.equipment.helmet !== undefined) {
          playPotion();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              antidote_potion: antidote
            },
            inventory: {
              ...player.inventory,
              antidote_potions: antidotesOnInventory
            }
          });
        } 
      }
      if(over.data.current?.type === 'enhancer') {
        const enhancer = player?.inventory.enhancer_potions.find(enhancer => enhancer._id === active.id);
        const currentEnhancerEquiped = player?.equipment.enhancer_potion;
        const enhancersOnInventory: EnhancerPotion[] = player?.inventory?.enhancer_potions?.filter(enhancer => enhancer._id !== active.id) || [];
        enhancersOnInventory?.push(currentEnhancerEquiped!);
        if(enhancer !== undefined && player?.equipment.helmet !== undefined) {
          playPotion();
          setPlayer({
            ...player, 
            equipment: { 
              ...player?.equipment, 
              enhancer_potion: enhancer
            },
            inventory: {
              ...player.inventory,
              enhancer_potions: enhancersOnInventory
            }
          });
        } 
      }
    }
  }

  if (loading) {
    return <Loading />;
  }
  if (error) return <div className="text-4xl text-center">{error}</div>;

  return (
    <Layout>
    <div className="mx-auto flex-col text-medievalSepia">
      {isRegistered && player ? (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex flex-col text-medievalSepia bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url(/images/map.jpg)'}}>
          <div className="flex justify-center">
            <div className="w-1/3 p-4">
              <div className="w-full h-full p-8 border-1 border-sepia bg-black/70">
                <h2 className="text-3xl py-2 px-4 mb-4 text-center border-1 bg-black/70  border-sepia">Use your attributes wisely.</h2>
                <ProgressBar label="Charisma" value={currentAttributes?.charisma} maxValue={300} />
                <ProgressBar label="Constitution" value={currentAttributes?.constitution} maxValue={300} />
                <ProgressBar label="Dexterity" value={currentAttributes?.dexterity} maxValue={300} />
                <ProgressBar label="Insanity" value={currentAttributes?.insanity} maxValue={300} />
                <ProgressBar label="Intelligence" value={currentAttributes?.intelligence} maxValue={300} />
                <ProgressBar label="Strength" value={currentAttributes?.strength} maxValue={500} />
                <ProgressBar label="Hit Points based on CON + DEX - INS/2" value={hitPoints} maxValue={1000} />
                <ProgressBar label="Attack based on STR - INS / 2" value={attack} maxValue={1000} />
                <ProgressBar label="Defense based on DEX + CON + INT/2" value={defense} maxValue={1000} />
                <ProgressBar label="Magic resistance based on INT + CHA" value={magicResistance} maxValue={1000} />
                <ProgressBar label="CFP (critical or fumble probability) based on INS" value={cfp} maxValue={1000} />
                <ProgressBar label="BCFA (base critical & fumble attack) based on STR + INS" value={bcfa} maxValue={1000} />
              </div>
            </div>
            <div className="w-1/3 p-4">
              <div className="w-full h-full p-8 border-1 border-sepia bg-black/70">
                {warningVisible 
                ? <KaotikaButton handleClick={updatePlayerEquipment} text="WARNING. Your equipment has changed. Save it!" /> 
                : <h2 className="text-3xl py-2 px-4 mb-4 text-center border-1  border-sepia bg-black/70 " style={warningVisible ? mountedStyle : unmountedStyle}>Your equipment is up to date.</h2>
                }
                <div className="grid grid-cols-6 gap-4 justify-items-center items-center content-center">
                  <div className="col-start-1 col-span-2">
                    <User   
                      name="Profile"
                      description={player.profile?.name}
                      avatarProps={{
                        src: `${player.profile?.image}`
                      }}
                      classNames={{
                        base: "bg-black/70 p-1 border-1 border-sepia w-full",
                        wrapper: "justify-items-center items-center content-center p-1",
                        name: "text-medievalSepia text-2xl text-darkSepia",
                        description: "text-2xl text-yellow-300/70",
                      }}    
                    />
                  </div>
                  <div className="col-start-3 col-span-2">
                    <Droppable id={100} type='helmet' children={player.equipment.helmet 
                    ? 
                      <Draggable id="helmet_1" tooltip={<DefenseTooltip element={player.equipment.helmet} equiped={null}/>} position='left' type={['helmet', 'inventory']} element={player.equipment.helmet} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-sm aspect-square" width="100px" border="3px ridge #cda882" /> 
                    : 
                      <img id="helmet_2" src="/images/helmet_back.jpg" className="object-contain rounded-sm aspect-square" width="100px" style={{'border': "3px ridge #000000"}} />}/>
                  </div>
                  <div className="col-start-5 col-span-2">
                    <User   
                      name="Level"
                      description={player.level}
                      avatarProps={{
                        src: "/images/icons/level.png"
                      }}
                      classNames={{
                        base: "bg-black/70 p-1 border-1 border-sepia w-full",
                        wrapper: "justify-items-center items-center content-center p-1",
                        name: "text-medievalSepia text-2xl text-darkSepia",
                        description: "text-2xl text-yellow-300/70",
                      }}    
                    />
                  </div>
                  <div className="col-start-1 col-end-3">
                    <Droppable id={200} type='weapon' children={player.equipment.weapon 
                    ? 
                      <Draggable id="weapon_1" tooltip={<WeaponTooltip element={player.equipment.weapon} equiped={null}/>} position='left' type={['weapon', 'inventory']} element={player.equipment.weapon} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="100px" border="3px ridge #cda882" /> 
                    : 
                      <img id="weapon_2" src="/images/sword_back.jpg" className="w-1/4 h-full object-contain rounded-full" width="100px" style={{'border': "3px ridge #000000"}} />}/>
                  </div>
                  <div className="col-start-3 col-end-5">
                    <Droppable id={300} type='armor' children={player.equipment.armor 
                    ? 
                      <Draggable id="armor_1" tooltip={<DefenseTooltip element={player.equipment.armor} equiped={null}/>} position='left' type={['armor', 'inventory']} element={player.equipment.armor} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-sm" width="125px" border="3px ridge #cda882" /> 
                    : 
                      <img id="armor_2" src="/images/armor_back.jpg" className="w-1/4 h-full object-contain rounded-sm" width="125px" style={{'border': "3px ridge #000000"}} />}/>
                  </div>
                  <div className="col-end-7 col-span-2">
                    <Droppable id={400} type='shield' children={player.equipment.shield 
                    ? 
                      <Draggable id="shield_1" tooltip={<DefenseTooltip element={player.equipment.shield} equiped={null}/>} position='right' type={['shield', 'inventory']} element={player.equipment.shield} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="100px" border="3px ridge #cda882" /> 
                    : 
                      <img id="shield_2" src="/images/shield_back.jpg" className="object-contain rounded-full" width="100px" style={{'border': "3px ridge #000000"}} />}/>
                  </div>
                  <div className="col-start-1 col-end-3">
                    <Droppable id={500} type='artifact' children={player.equipment.artifact 
                    ? 
                      <Draggable id="artifact_1" tooltip={<CommonTooltip element={player.equipment.artifact} equiped={null}/>} position='left' type={['artifact', 'inventory']} element={player.equipment.artifact} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="100px" border="3px ridge #cda882" /> 
                    : 
                      <img id="artifact_2" src="/images/artifact_back.jpg" className="w-1/4 h-full object-contain rounded-full" width="100px" style={{'border': "3px ridge #000000"}} />}/>
                    </div>
                  <div className="col-start-3 col-end-5">
                  <Droppable id={600} type='boot' children={player.equipment.boot 
                    ? 
                      <Draggable id="boot_1" tooltip={<DefenseTooltip element={player.equipment.boot} equiped={null}/>} position='top' type={['boot', 'inventory']} element={player.equipment.boot} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-sm" width="100px" border="3px ridge #cda882" /> 
                    : 
                      <img id="boot_2" src="/images/boots_back.jpg" className="object-contain rounded-sm" width="100px" style={{'border': "3px ridge #000000"}} />}/>
                    </div>
                  <div className="col-end-7 col-span-2">
                    <Droppable id={700} type='ring' children={player.equipment.ring 
                    ? 
                      <Draggable id="ring_1" tooltip={<CommonTooltip element={player.equipment.ring} equiped={null}/>} position='right' type={['ring', 'inventory']} element={player.equipment.ring} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="100px" border="3px ridge #cda882" /> 
                    : 
                      <img id="ring_2" src="/images/ring_back.png" className="object-contain rounded-full" width="100px" style={{'border': "3px ridge #000000"}} />}/>
                  </div>
                </div>
                <div className="grid grid-cols-3 grid-rows-1 flex-grow justify-items-center items-center pt-10">
                  <Droppable id={800} type='healing' children={player.equipment.healing_potion 
                  ? 
                    <Draggable id="healing_1" tooltip={<HealingPotionTooltip element={player.equipment.healing_potion} equiped={null}/>} position='top' type={['healing', 'inventory']} element={player.equipment.healing_potion} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="75px" border="3px ridge #cda882" /> 
                  : 
                    <img id="healing_2" src="/images/healing_potion_back.jpg" className="w-1/4 h-full object-contain" width="75px" style={{'border': "3px ridge #000000"}} />}/>

                  <Droppable id={900} type='antidote' children={player.equipment.antidote_potion 
                  ? 
                    <Draggable id="antidote_1" tooltip={<AntidotePotionTooltip element={player.equipment.antidote_potion} equiped={null}/>} position='top' type={['antidote', 'inventory']} element={player.equipment.antidote_potion} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="75px" border="3px ridge #cda882" /> 
                  : 
                    <img id="antidote_2" src="/images/antidote_potion_back.jpg" className="w-1/4 h-full object-contain" width="75px" style={{'border': "3px ridge #000000"}} />}/>

                  <Droppable id={1000} type='enhancer' children={player.equipment.enhancer_potion 
                  ? 
                    <Draggable id="enhancer_1" tooltip={<EnhancerPotionTooltip element={player.equipment.enhancer_potion} equiped={null}/>} position='top' type={['enhancer', 'inventory']} element={player.equipment.enhancer_potion} tooltipClassName="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className="w-1/4 h-full object-contain rounded-full" width="75px" border="3px ridge #cda882" /> 
                  : 
                    <img id="enhancer_2" src="/images/enhancer_potion_back.jpg" className="w-1/4 h-full object-contain" width="75px" style={{'border': "3px ridge #000000"}} />}/>
                </div>
                <div className="grid grid-cols-3 grid-rows-1  justify-items-center items-center pt-10">
                  <div className="col-start-1 col-span-1">
                    <User   
                      name="Experience"
                      description={`${player.experience} xp`}
                      avatarProps={{
                        src: "/images/icons/experience.png"
                      }}
                      classNames={{
                        base: "bg-black/70 p-1 border-1 border-sepia w-full",
                        wrapper: "justify-items-center items-center content-center p-1",
                        name: "text-medievalSepia text-2xl text-darkSepia",
                        description: "text-2xl text-yellow-300/70",
                      }}    
                    />
                  </div>
                  <div className="col-start-2 col-span-1">
                    <User   
                      name="Next level"
                      description={`${((player.level)) * EXP_POINTS} xp`}
                      avatarProps={{
                        src: "/images/icons/up.png"
                      }}
                      classNames={{
                        base: "bg-black/70 p-1 border-1 border-sepia w-full",
                        wrapper: "justify-items-center items-center content-center p-1",
                        name: "text-medievalSepia text-2xl text-darkSepia",
                        description: "text-2xl text-yellow-300/70",
                      }}    
                    />
                  </div>
                  <div className="col-start-3 col-span-1">
                    <User   
                      name="Gold"
                      description={player.gold}
                      avatarProps={{
                        src: "/images/icons/gold.png"
                      }}
                      classNames={{
                        base: "bg-black/70 p-1 border-1 border-sepia w-full",
                        wrapper: "justify-items-center items-center content-center p-1",
                        name: "text-medievalSepia text-2xl text-darkSepia",
                        description: "text-2xl text-yellow-300/70",
                      }}    
                    />
                  </div>
                </div>           
              </div>
            </div>
            <div className="w-1/3 p-4">
              <div className="w-full h-full bg-black/70">
                <div className="grid grid-cols-8 grid-rows-8 flex-grow">
                  {
                    player.inventory.helmets.map(helmet => {
                      return (
                        <div key={helmet._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={10}  type='inventory' children={<Draggable id={helmet._id} tooltip={<DefenseTooltip element={helmet} equiped={player.equipment.helmet}/>} position='bottom' type={[`${helmet.min_lvl <= player.level ? helmet.type : null}`, 'inventory']} element={helmet} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.weapons.map(weapon => {
                      return (
                        <div key={weapon._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={20}  type='inventory' children={<Draggable id={weapon._id} tooltip={<WeaponTooltip element={weapon} equiped={player.equipment.weapon}/>} position='bottom' type={[`${weapon.min_lvl <= player.level ? weapon.type : null}`, 'inventory']} element={weapon} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.armors.map(armor => {
                      return (
                        <div key={armor._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>    
                            <Droppable id={30}  type='inventory' children={<Draggable id={armor._id} tooltip={<DefenseTooltip element={armor} equiped={player.equipment.armor}/>} position='bottom' type={[`${armor.min_lvl <= player.level ? armor.type : null}`, 'inventory']} element={armor} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>                      
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.shields.map(shield => {
                      return (
                        <div key={shield._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={40}  type='inventory' children={<Draggable id={shield._id} tooltip={<DefenseTooltip element={shield} equiped={player.equipment.shield}/>} position='bottom' type={[`${shield.min_lvl <= player.level ? shield.type : null}`, 'inventory']} element={shield} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.artifacts.map(artifact => {
                      return (
                        <div key={artifact._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={50}  type='inventory' children={<Draggable id={artifact._id} tooltip={<CommonTooltip element={artifact} equiped={player.equipment.artifact}/>} position='bottom' type={[`${artifact.min_lvl <= player.level ? artifact.type : null}`, 'inventory']} element={artifact} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.boots.map(boot => {
                      return (
                        <div key={boot._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={1}  type='inventory' children={<Draggable id={boot._id} tooltip={<DefenseTooltip element={boot} equiped={player.equipment.boot}/>} position='bottom' type={[`${boot.min_lvl <= player.level ? boot.type : null}`, 'inventory']} element={boot} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.rings.map(ring => {
                      return (
                        <div key={ring._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={1}  type='inventory' children={<Draggable id={ring._id} tooltip={<CommonTooltip element={ring} equiped={player.equipment.ring}/>} position='bottom' type={[`${ring.min_lvl <= player.level ? ring.type : null}`, 'inventory']} element={ring} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {/* {
                    player.inventory.healing_potions.map(healing => {
                      return (
                        <div key={healing._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={1}  type='inventory' children={<Draggable id={healing._id} tooltip={<HealingPotionTooltip element={healing} equiped={player.equipment.healing_potion}/>} position='bottom' type={[`${healing.type}`, 'inventory']} element={healing} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.antidote_potions.map(antidote => {
                      return (
                        <div key={antidote._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={1}  type='inventory' children={<Draggable id={antidote._id} tooltip={<AntidotePotionTooltip element={antidote} equiped={player.equipment.antidote_potion}/>} position='bottom' type={[`${antidote.type}`, 'inventory']} element={antidote} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  }
                  {
                    player.inventory.enhancer_potions.map(enhancer => {
                      return (
                        <div key={enhancer._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                          <Droppable id={1}  type='inventory' children={<Draggable id={enhancer._id} tooltip={<EnhancerPotionTooltip element={enhancer} equiped={player.equipment.enhancer_potion}/>} position='bottom' type={[`${enhancer.type}`, 'inventory']} element={enhancer} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
                        </div>
                      )
                    })
                  } */}
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
                      // - player.inventory.healing_potions.length
                      // - player.inventory.antidote_potions.length
                      // - player.inventory.enhancer_potions.length
                    }).map((element,index) => <div key={index} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}><Droppable id={23} type='inventory'  children={null}/></div> ) 
                  }                      
                </div>
              </div>
            </div>
          </div>
        </div>
        </DndContext>
      ) : (
        <>
        <div className="w-full flex p-4">
          <div className="w-1/3 p-4">
          <h1 className="text-4xl mb-4 animate-bounce">Select your Hero Profile </h1>        
            <select
              className="block w-full bg-gray-700 border-medievalSepia py-4 pl-6 pr-10 text-3xl"
              onChange={(e) => handleSelectedOption(e.target.value)}
              value={selectedOption}
            >
              <option value="" disabled>Select a profile</option>
              {profiles.map((item) => (
                <option key={item._id} value={item._id}>
                {item.name}
                </option>
              ))}
            </select>
            {selectedOption ? (
              <div className="mb-5 mt-10">
                <p className="text-3xl text-medievalDarkSepia mb-4">{currentProfile?.description}</p>
              </div>
            ): null}
          </div>
          {selectedOption ? (
            <>
              <div className="w-1/3 p-4 text-center">
                <h1 className="text-4xl mb-4">{currentProfile?.name}</h1>
                <img
                  className="mx-auto mb-8 sepia hover:sepia-0 transition"
                  src={currentProfile?.image} 
                  alt={currentProfile?.name}
                />
              </div>
              <div className="w-1/3 p-4">
                <div className="mb-5">
                  <h1 className="text-4xl mb-4">Initial attribute points</h1>
                  {currentProfile?.attributes.map((attribute) => (
                    <Tooltip key={attribute.name} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" size='sm' showArrow={true} content={<AttributeTooltip element={attribute}/>}>
                      <div key={attribute.name} className='p-2 cursor-pointer hover:bg-neutral-600 transition rounded-lg'>
                        <Progress
                          key={attribute.name}
                          size="lg" 
                          radius="sm"
                          minValue={0}
                          maxValue={100}
                          classNames={{
                            track: "drop-shadow-md border border-sepia h-2",
                            indicator: "bg-medievalSepia h-2",
                            label: PROGRESS_LABEL,
                            value: PROGRESS_VALUE,
                          }}
                          formatOptions={{style: "decimal"}}
                          label={attribute.name}
                          value={attribute.value}
                          showValueLabel={true}
                        />  
                      </div>
                    </Tooltip>
                  ))}                   
                </div>
                  <KaotikaNextButton handleNext={handleNext} />
              </div>
            </>
          ) : null}
        </div>
        </>
        ) }
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: 'w-96 text-4xl p-2 text-center mb-4 border-1 rounded-lg border-sepia bg-black/90',
              title: 'text-4xl text-red-800',
              
            },
            style: {
              fontFamily: 'kaotika'
            }
          }}
        />
    </div>
    </Layout>
    
    );
}
export default PlayerPage;