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
      <a className="w-[250px] h-[500px] perspective-1000 block"> {/* Añadimos `block` para que el enlace abarque toda la tarjeta */}
        <div className="relative w-full h-full transition-transform duration-1000 transform-style-preserve-3d hover:rotate-y-180">
          {/* Frente de la tarjeta */}
          <div className="absolute w-full h-full bg-gray-800 text-white flex justify-center items-center backface-hidden">
            <img
              src={`images/sellers/${merchantId}.png`}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Parte trasera de la tarjeta */}
          <div className="absolute w-full h-full bg-gray-800 text-white flex flex-col justify-between items-center backface-hidden rotate-y-180 p-4">
            <h1 className="text-center text-2xl font-bold mt-2 text-yellow-500">{name}</h1>
            <p className="text-center m-4 text-lg leading-6">{description}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default FlipCard;