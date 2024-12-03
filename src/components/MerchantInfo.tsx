import React from "react";

interface MerchantInfoProps {
  merchantImage: string; // URL de la imagen del mercader
  merchantName: string;  // Nombre del mercader
}

const MerchantInfo: React.FC<MerchantInfoProps> = ({ merchantImage, merchantName }) => {
  return (
    <div className="flex flex-col items-center p-4 text-black">
      <img
        src={merchantImage || "/placeholder-merchant.jpg"}
        alt={merchantName || "Merchant"}
        className="w-32 h-32 object-cover rounded-full mb-4"
      />
      <h2 className="text-lg font-bold">{merchantName || "Unnamed Merchant"}</h2>
    </div>
  );
};

export default MerchantInfo;