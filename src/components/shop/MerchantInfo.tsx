import React from "react";

interface MerchantInfoProps {
  merchantImage: string; // URL de la imagen del mercader
  merchantName: string;  // Nombre del mercader
}

const MerchantInfo: React.FC<MerchantInfoProps> = ({ merchantImage, merchantName }) => {
  return (
    <div className="flex flex-col items-center p-4 text-black">
      {/* Contenedor relativo para permitir posicionamiento absoluto */}
      <div className="relative w-[55%] h-[55%]">
        {/* Imagen principal (vendedor) */}
        <img
          src={merchantImage || "/placeholder-merchant.jpg"}
          alt={merchantName || "Merchant"}
          className="w-full h-full object-cover rounded-full"
        />
        </div>
        {/* Imagen superpuesta */}
        <div className="absolute w-[40%] h-[40%] bottom-[45%]">
        <img
          src="/images/seller_border.png" // Cambia la ruta a la imagen que quieres superponer
          alt="Overlay"
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />
        </div>

      {/* Nombre del mercader */}
      <h2 className="text-2xl font-bold mt-14">{merchantName || "Unnamed Merchant"}</h2>
    </div>
  );
};

export default MerchantInfo;