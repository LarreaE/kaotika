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
import ItemDisplay from '@/components/shop/CartPreview';
import ItemCarousel from '@/components/shop/ItemCarousel';
import { calculateAllAttributes } from '@/helpers/PlayerAttributes';
import { Modifier } from '@/_common/interfaces/Modifier';
import SellItemCard from '@/components/shop/SellItemCard';
import SellConfirmationModal from '@/components/shop/SellConfirmationModal';
import SellItemDetailModal from '@/components/shop/SellItemDetailModal';
import SellInventory from '@/components/shop/SellInventory';
import { Armor } from '@/_common/interfaces/Armor';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Boot } from '@/_common/interfaces/Boot';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Ring } from '@/_common/interfaces/Ring';
import { Shield } from '@/_common/interfaces/Shield';
import { Weapon } from '@/_common/interfaces/Weapon';
import populatePlayer from '@/helpers/populatePlayer';

const MerchantPage: React.FC = () => {

  type Item = Weapon | Armor | Boot | Helmet | Artifact | Ring | Shield;


  const { data: session, status } = useSession();
  const router = useRouter();
  const { merchantId } = router.query;

  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState<string | null>(null);
  const [availableMoney, setAvailableMoney] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentAttributes, setCurrentAttributes] = useState<Modifier>();

  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [confirmationDetails, setConfirmationDetails] = useState<{ currentGold: number; newGold: number; item: Item | null } | null>(null);
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

  const handleSell = async (item, quantity) => {
    console.log('Handling sell for item:', item); // Log para ver el artículo que se está vendiendo
    console.log('Quantity to sell:', quantity); // Log para verificar la cantidad seleccionada
  
    if (!item || !player || quantity < 1) return;
  
    try {
      setLoading(true);
  
      // Calcular el valor de la venta por unidad
      const sellValue = Math.floor(item.value / 3);
      console.log('Calculated sell value per item:', sellValue); // Log para ver el valor calculado de la venta por artículo
  
      // Realizar la venta por la cantidad seleccionada
      for (let i = 0; i < quantity; i++) {
        console.log(`Selling item #${i + 1}`);
        
        // Codificar el artículo
        const encodedItem = encodeURIComponent(JSON.stringify({ ...item, quantityToSell: 1 }));
  
        // Enviar la venta al backend
        const res = await fetch(`/api/shop/sell/${player?.email}/${encodedItem}`);
        console.log('Response from server for sale #', i + 1, ':', res); // Log para la respuesta del servidor por cada venta
  
        if (res.status === 200) {
          const response = await res.json();
          console.log('Server response after sale:', response); // Log para la respuesta del servidor después de cada venta
          setPlayer(response);
          setAvailableMoney(response.gold); // Actualiza el oro disponible después de cada venta
          setSelectedItem(null)
        } else {
          setError('Failed to sell');
          console.error('Failed to sell. Status:', res.status); // Log para errores de venta
          break; // Si ocurre un error, salir del bucle
        }
      }
    } catch (error) {
      console.error('Failed to complete sell:', error); // Log para errores en el proceso
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

  const selectItem = (item: Item) => {
    console.log('Selected item:', item); // Log para verificar el artículo seleccionado
    setSelectedItem(item);
  };
  
  const initiateSell = (item: Item) => {
    if (!player) return;
  
    const sellValue = Math.floor(item.value / 3);
    console.log('Initiating sell for item:', item); // Log para verificar la venta antes de confirmar
    console.log('Current gold:', player.gold); // Log para ver el oro actual del jugador
    console.log('New gold after sell:', player.gold + sellValue); // Log para ver el oro que se recibirá después de la venta
  
    setConfirmationDetails({
      currentGold: player.gold,
      newGold: player.gold + sellValue,
      item,
    });
    setIsConfirming(true);
  };
  

  if (!session) return null;

  const allItems: Item[] = [];
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

        {/* Lateral Izquierdo con estilo Skyrim (bordes sepia, botones antiguos) */}
        <div className="w-3/12 relative p-4 bg-black/60 text-gray-200 rounded shadow-lg border-sepia border-2 flex flex-col items-center">
          {/* Botón para regresar */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2 z-10"
          >
            ←
          </button>
          {/* Esquinas decorativas */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sepia"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sepia"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sepia"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sepia"></div>

          {/* Título del Merchant */}
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1 bg-black/40 border-sepia border-2 uppercase font-bold text-lg tracking-wide text-center">
              Merchant {merchantId}
            </div>
          </div>

          <div className="mb-4 flex justify-center">
            <img
              src="/images/sellers/buyer.png"
              alt={`Merchant ${merchantId}`}
              className="object-contain h-32"
            />
          </div>

          <div className="border-t-2 border-sepia pt-4 w-full">
            <ItemStats
              selectedItem={selectedItem}
              player={player}
            />
          </div>
        </div>

        {/* Panel central */}
        {selectedItem ? (
          <div className="w-5/12 bg-black bg-opacity-60 text-gray-200 rounded shadow-lg p-6 relative border-sepia border-2 flex flex-col items-center">
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sepia"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sepia"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sepia"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sepia"></div>

            <SellItemCard selectedItem={selectedItem} />
            <div className="flex flex-row items-center justify-center gap-x-4 mt-8">
              <button
                onClick={handleViewDetails}
                className="bg-black bg-opacity-70 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
              >
                View details
              </button>
              {selectedItem && (
                <button
                  onClick={() => initiateSell(selectedItem)}
                  className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                >
                  Sell for {Math.floor(selectedItem.value / 3)}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-5/12 bg-black bg-opacity-60 text-gray-200 rounded shadow-lg p-6 relative border-sepia border-2 flex flex-col items-center">
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sepia"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sepia"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sepia"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sepia"></div>
            {/* Panel vacío */}
          </div>
        )}

        {/* Panel derecho */}
        <div className="w-4/12 bg-black bg-opacity-60 text-gray-200 rounded shadow-lg p-4 relative border-sepia border-2 flex flex-col items-center">
          {/* Esquinas decorativas */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sepia"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sepia"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sepia"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sepia"></div>

          {player && (
            <div className="w-2/5 h-auto p-2 bg-black/40 border-sepia border-2 flex items-center justify-between rounded-lg shadow mb-4 self-end mr-4">
              <div className="text-white text-2xl font-bold">Gold</div>
              <div className="flex items-center">
                <p className="text-white text-3xl font-bold">{player.gold}</p>
                <img
                  src="/images/shop/gold.png"
                  alt="gold coin"
                  className="w-8 h-8 ml-2"
                />
              </div>
            </div>
          )}
          {player &&
            <SellInventory
              player={player}
              GRID_NUMBER={64}
              selectItem={selectItem}
            />
          }
        </div>
      </div>
    </Layout>
  );
};

export default MerchantPage;