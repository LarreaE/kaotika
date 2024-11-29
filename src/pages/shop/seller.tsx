import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';

const Shop = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

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
      <div className="bg-sky-950 bg-opacity-90 min-h-screen flex flex-row">
        {/* aqui va ha estar el vendedor y la informacion sobre que tienda es */}
        <div className="w-3/12 p-4 bg-fuchsia-700 bg-opacity-10 flex flex-col items-center">
          <div className="flex space-x-4">
            {/* este es el cartel que va atener el boton para hechar para atras */}
            <div className="relative w-1/4">
              <img
                src="/images/shop/cartel_colgante.png"
                alt="Imagen 1"
                className="w-full h-full"
              />
              {/* aqui va ha estar el texto de que tipo de vendedor es */}
                <div className="absolute inset-0 top-1/4 flex items-center justify-center">
                    <button onClick={() => console.log('Botón clicado')}>
                        <img
                            src="/images/shop/flecha_retroceso.png"
                            alt="Botón"
                            className="w-16 h-16 cursor-pointer"
                        />
                    </button>
                </div>
            </div>
            {/* este es el cartel que va atener el nombre del vendedor y que tinenda es en especifico en este caso seller viene a ser el que te compra tus productos */}
            <div className="relative w-3/4">
              <img
                src="/images/shop/cartel_colgante.png"
                alt="Imagen 2"
                className="w-full"
              />
              {/* aqui va ha estar el texto de que tipo de vendedor es */}
              <div className="absolute inset-0 top-1/4 flex items-center justify-center">

                <p className="text-white text-6xl font-bold">The Seller</p>
              </div>
            </div>
          </div>
        </div>
        {/* aqui va ha estar el objeto que tengas seleccionado del inventario */}
        <div className="w-5/12 p-4 bg-red-900 bg-opacity-10 flex items-center justify-center">
        </div>
        {/* aqui va ha estar el inventario en el que vas a poder seleccionar los objetos para luego venderlos */}
        <div className="w-4/12 p-4 bg-lime-500 bg-opacity-10 flex items-center justify-center">
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
