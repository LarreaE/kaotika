import React from "react";
import { FaArrowLeft } from 'react-icons/fa'; // Icono de la flecha hacia la izquierda

interface MerchantInfoProps {
  merchantImage: string; // URL de la imagen del mercader
  merchantName: string;  // Nombre del mercader
}

const MerchantInfo: React.FC<MerchantInfoProps> = ({ merchantImage, merchantName }) => {
  return (
    <div className="flex flex-col items-center p-4 text-black w-[90%] mt-[-5%]">
      {/* Botón de la flecha hacia la izquierda */}
      <div className="flex justify-start w-full mb-4">
        <button
          onClick={() => window.history.back()}  // Acción para cambiar de pantalla
          className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 border-2 border-sepia z-20">
          <FaArrowLeft size={24} /> {/* Icono de la flecha hacia la izquierda */}
        </button>
      </div>

      {/* Contenedor para las imágenes */}
      <div className="flex flex-col items-center justify-center mt-4 w-[60%]">
        {/* Imagen principal (vendedor) */}
        <div className="flex justify-center items-center "> {/* Ajustamos la superposición */}
          <img
            src={merchantImage || "/placeholder-merchant.jpg"}
            alt={merchantName || "Merchant"}
            className="w-[80%] h-[80%] object-cover rounded-full"
          />
        </div>

        {/* Imagen superpuesta (marco) */}
        <div className="flex justify-center items-center absolute w-[30%] h-[30%]">
          <img
            src="/images/seller_border.png" // Imagen del marco
            alt="Overlay"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Nombre del mercader */}
      <h2 className="text-2xl font-bold mt-[12%]">{merchantName || "Unnamed Merchant"}</h2>
    </div>
  );
};

export default MerchantInfo;
