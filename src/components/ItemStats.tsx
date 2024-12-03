import React from 'react';

// Ajusta el import según el tipo de items que quieres soportar
import { Weapon } from '../_common/interfaces/Weapon';
import { Armor } from '../_common/interfaces/Armor';
import { Boot } from '@/_common/interfaces/Boot';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Ring } from '@/_common/interfaces/Ring';
import { Shield } from '@/_common/interfaces/Shield';
import isModifier from '@/helpers/IsModifier';


type Item = Weapon | Armor | Boot | Helmet | Artifact | Ring | Shield; 

interface ItemStatsProps {
  selectedItem: Item | null; 
}

const ItemStats: React.FC<ItemStatsProps> = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <div className="text-center text-gray-500 italic">
        Selecciona un elemento para ver sus estadísticas.
      </div>
    );
  }

  const renderAttributes = () => {
    return Object.entries(selectedItem).map(([key, value]) => {
      if (typeof value === 'object' && isModifier(value)) {
        return (
          <div key={key} className="mt-4 text-xl">
            <p className="text-2xl font-bold text-yellow-500">{key.toUpperCase()}</p>
            {Object.entries(value).map(([modKey, modValue]) => {
              if (modValue === 0 || modKey === '_id') {
                return null;
              }
              const textColor = modValue > 0 ? 'text-green-500' : 'text-red-500';
              return (
                <p key={modKey} className={`text-l ${textColor}`}>
                  <strong>{modKey}</strong> {modValue}
                </p>
              );
            })}
          </div>
        );
      }
      return null;
    });
  };
  return (
    <div className="p-4 bg-gray-700 rounded shadow-md text-white border-2 border-yellow-500">
      <h3 className="text-3xl font-semibold">{selectedItem.name}</h3>
      {renderAttributes()}
    </div>
  );
};

export default ItemStats;