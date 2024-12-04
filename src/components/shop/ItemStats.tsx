import React from 'react';
import ProgressBar from '../ProgressBar';

import { Weapon } from '../../_common/interfaces/Weapon';
import { Armor } from '../../_common/interfaces/Armor';
import { Boot } from '@/_common/interfaces/Boot';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Ring } from '@/_common/interfaces/Ring';
import { Shield } from '@/_common/interfaces/Shield';
import isModifier from '@/helpers/IsModifier';
import { Attribute } from '@/_common/interfaces/Attribute';

type Item = Weapon | Armor | Boot | Helmet | Artifact | Ring | Shield; 

interface ItemStatsProps {
  selectedItem: Item | null; 
  atributtes: Attribute;
  playerLevel: number; // Agregamos el nivel del jugador
}

const ItemStats: React.FC<ItemStatsProps> = ({ selectedItem, atributtes, playerLevel }) => {
  if (!selectedItem) {
    return (
      <div className="text-center text-gray-500 italic">
        Selecciona un elemento para ver sus estadísticas.
      </div>
    );
  }

  const renderAttributeProgressBars = () => {
    return Object.entries(atributtes).map(([attrName, baseValue]) => {
      // Obtener el modificador del objeto seleccionado para este atributo
      let modifierValue = 0;

      Object.entries(selectedItem).forEach(([key, value]) => {
        if (typeof value === 'object' && isModifier(value)) {
          Object.entries(value).forEach(([modKey, modValue]) => {
            if (modKey === attrName) {
              modifierValue += modValue;
            }
          });
        }
      });

      const totalValue = baseValue + modifierValue;

      // Determinar el valor máximo para la barra de progreso
      const maxValue = Math.max(baseValue, totalValue, 100);

      // Crear el label que muestra el atributo, valor base y modificador
      const label = `${attrName.toUpperCase()}: ${baseValue} ${modifierValue !== 0 ? (modifierValue > 0 ? `+${modifierValue}` : `${modifierValue}`) : ''}`;

      return (
        <div key={attrName} className="mb-4">
          <ProgressBar
            label={label}
            value={totalValue}
            maxValue={maxValue}
          />
        </div>
      );
    });
  };

  // Obtener el nivel mínimo requerido del objeto
  const itemMinLevel = selectedItem.min_lvl || 1; // Asegúrate de que la propiedad sea correcta

  // Determinar el color según la comparación de niveles
  const levelColor = itemMinLevel <= playerLevel ? 'text-green-400' : 'text-red-400';

  return (
    <div className="p-4 bg-gray-900 rounded shadow-md text-white border-2 border-yellow-500">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-semibold">{selectedItem.name}</h3>
        <p className={`text-xl font-semibold ${levelColor}`}>
          Min lvl: {itemMinLevel}
        </p>
      </div>
      {renderAttributeProgressBars()}
    </div>
  );
};

export default ItemStats;