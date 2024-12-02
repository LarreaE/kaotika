import React from "react";
import Link from "next/link"; // Importar el componente Link de Next.js

// Define los tipos para las props
interface FlipCardProps {
  name: string;
  description: string;
  merchantId: string;
  profession: string; // Añadimos la profesión del mercader
}

const FlipCard: React.FC<FlipCardProps> = ({ name, description, merchantId, profession }) => {
  return (
    <Link legacyBehavior href={`/shop/${profession}`}>
      <a className="w-[400px] h-[550px] perspective-1000 block"> {/* `block` asegura que el enlace abarque toda la tarjeta */}
        <div className="relative w-full h-full transition-transform duration-1000 transform-style-preserve-3d hover:rotate-y-180">
          {/* Frente de la tarjeta */}
          <div className="absolute w-full h-full bg-gray-900 text-white flex justify-center items-center backface-hidden">
            {/* Contenedor del borde */}
            <div className="relative w-full h-full">
                 {/* Imagen principal más pequeña */}
              <img
                src={`images/sellers/${merchantId}.png`}
                alt={name}
                className="relative w-[80%] h-[75%] object-cover z-20 mx-auto my-auto top-20"
              />
              {/* Imagen del borde */}
              <img
                src={`images/sellers/shop_border.png`}
                alt="Border"
                className="absolute top-0 left-0 w-[100%] h-[100%] object-contain z-30 pointer-events-none"
              />
            </div>
          </div>
          {/* Parte trasera de la tarjeta */}
            <div className="absolute w-full h-full bg-gray-900 text-white flex flex-col items-center backface-hidden rotate-y-180 p-8 space-y-6">
                <h1 className="text-center text-3xl font-bold text-yellow-500 mt-16">{name}</h1>
                <p className="text-center text-xl leading-6 max-w-40">{description}</p>
                {/* Imagen del borde */}
                <img
                    src={`images/sellers/shop_border_description.png`}
                    alt="Border"
                    className="absolute bottom-0 rigth-0 w-[100%] h-[100%] object-contain z-30 pointer-events-none"
                />
            </div>
        </div>
      </a>
    </Link>
  );
};

export default FlipCard;