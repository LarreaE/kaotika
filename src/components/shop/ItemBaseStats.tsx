import React from 'react';
import ProgressBar from './ProgressBar';

import { Weapon } from '../../_common/interfaces/Weapon';
import { Armor } from '@/_common/interfaces/Armor';
import { Boot } from '@/_common/interfaces/Boot';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Ring } from '@/_common/interfaces/Ring';
import { Shield } from '@/_common/interfaces/Shield';
import { Modifier } from '@/_common/interfaces/Modifier';
import { Player } from '@/_common/interfaces/Player';

type Item = Weapon | Armor | Boot | Helmet | Artifact | Ring | Shield;

interface ItemBaseStatsProps {
  selectedItem: Item | null;
  player: Player;
}

const ItemBaseStats: React.FC<ItemBaseStatsProps> = ({ selectedItem, player }) => {
  if (!selectedItem) {
    return (
      <div className="text-center text-gray-500 italic">
        Selecciona un elemento para ver sus estadísticas.
      </div>
    );
  }

  const attributesToDisplay: (keyof Modifier)[] = [
    'intelligence',
    'dexterity',
    'constitution',
    'insanity',
    'charisma',
    'strength',
  ];

  const renderAttributeProgressBars = () => {
    return attributesToDisplay.map((attrName) => {
      const value = selectedItem.modifiers?.[attrName] || 0;
      const isNegative = value < 0;
      const barColor = isNegative ? 'bg-red-500' : 'bg-green-500';
      const maxValue = Math.max(Math.abs(value), 50);
      const label = `${attrName.toUpperCase()}: ${isNegative ? `-${Math.abs(value)}` : value}`;

      return (
        <div key={attrName} className="mb-4">
          <ProgressBar
            label={label}
            value={Math.abs(value)} 
            maxValue={maxValue}
            barColor={barColor}
          />
        </div> 
      );
    });
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow-md text-white border-2 border-yellow-500">
      {renderAttributeProgressBars()}
    </div>
  );
};

export default ItemBaseStats;
