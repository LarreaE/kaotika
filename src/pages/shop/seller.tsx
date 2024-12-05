import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { useRouter } from 'next/router';

const Shop = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(session);

  

  useEffect(() => {
    console.log("useEffect Fetching Seller's Shop");
    if (!session) return;
    const fetchTheSeller = async () => {
      try {
        setLoading(true);
        console.log("Fetching Seller's shop");
        const res = await fetch('/api/player/seller');
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Failed to Seller's Shop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheSeller();
  }, []);

  if (loading) {
    return <Loading />;
  }
  
  return (
    <Layout>
      <div className="bg-[url('/images/shop/shop_background.png')] bg-cover bg-center bg-opacity-90 min-h-screen flex flex-row">
        {/* aqui va ha estar el vendedor y la informacion sobre que tienda es */}
        <div className="w-3/12 p-4 bg-black bg-opacity-70 flex flex-col items-center">
          <div className="flex space-x-4">
            {/* este es el cartel que va atener el boton para hechar para atras */}
            <div className="relative w-1/4">
              <img
                src="/images/shop/cartel_colgante.png"
                alt="hanging sign small"
                className="w-full h-3/4"
              />
              {/* aqui va ha estar el texto de que tipo de vendedor es */}
                <div className="relative inset-0 -top-24 flex items-center justify-center">
                    <button onClick={() => router.push('/shop')}>
                        <img
                            src="/images/shop/flecha_retroceso.png"
                            alt="back arrow"
                            className="w-16 h-16 cursor-pointer"
                        />
                    </button>
                </div>
            </div>
            {/* este es el cartel que va atener el nombre del vendedor y que tinenda es en especifico en este caso seller viene a ser el que te compra tus productos */}
            <div className="relative w-3/4">
              <img
                src="/images/shop/cartel_colgante.png"
                alt="hanging sign"
                className="w-full"
              />
              {/* aqui va ha estar el texto de que tipo de vendedor es */}
              <div className="relative inset-0 -top-24 flex items-center justify-center">
                <p className="text-white text-6xl font-bold">The Seller</p>
              </div>
            </div>
          </div>

          <div>
            <img
                  src="/images/shop/seller.png"
                  alt="hanging sign"
                  className="w-full"
                />
          </div>
          <div className="w-full h-full p-4 bg-red-900 bg-opacity-10 flex items-center justify-center">

          </div>
        </div>

        {/* aqui va ha estar el objeto que tengas seleccionado del inventario */}
        <div className="w-5/12 bg-red-900 bg-opacity-10 flex flex-col items-center rounded-3xl shadow-lg">
          {/* este es el contenedor que crea la tarjeta */}
          <div className="w-3/5 h-4/6 p-4 bg-black bg-opacity-70 flex flex-col items-center rounded-2xl shadow-lg border-4 border-sepia">
            
            {/* nombre de el objeto */}
            <div className="w-full text-center bg-medievalSepia py-2 rounded-t-2xl">
              <p className="text-black text-4xl font-bold">The Seller</p>
            </div>
            
            {/* aquie va la imagen del ojeto que sea */}
            <div className="w-3/5 mt-4 border-4 border-sepia rounded-xl overflow-hidden shadow-md bg-white">
              <img
                src="/images/equipment/armors/full_plate_28.png"
                alt="armor"
                className="w-full h-auto"
              />
            </div>
            
            {/* aqui aparecera la descripcin del objeto que tengas seleccionado */}
            <div className="w-full mt-4 text-center">
              <p className="text-white text-3xl font-medium">description</p>
            </div>
            
            {/* Precio base del objeto */}
            <div className="w-auto -bottom-12 mt-auto text-center bg-medievalSepia py-1 px-2 rounded-2xl flex flex-row items-center justify-center relative">
              <p className="text-black text-4xl font-bold mr-2">937</p>
              <img
                src="/images/shop/gold.png"
                alt="gold coin"
                className="w-12 h-12 ml-2"
              />
            </div>
          </div>
          {/* Contenedor para los botones para que se vea correctamente uno al lado del otro */}
          <div className="flex flex-row items-center justify-center gap-x-4 mt-16">
            {/* aqui va ha estar el boton para ver con mas detalle el objeto que tengas seleccionado */}
            <button 
              className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
              Ver detalles
            </button>

            {/* aqui va ha estar el boton para vvender el objeto aqui se calculara el precio base entre 3 */}
            <button 
              className="bg-black bg-opacity-70 text-white text-xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2">
              Vender por 312
            </button>
          </div>
        </div>

        {/* aqui va ha estar el inventario en el que vas a poder seleccionar los objetos para luego venderlos */}
        <div className="w-4/12 p-4 bg-black bg-opacity-70 flex items-center justify-center">

        </div>
      </div>
    </Layout>
  );
};

export default Shop;
