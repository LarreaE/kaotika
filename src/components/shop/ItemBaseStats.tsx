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
  selectedItem: Item | any;
  player: Player | any;
}

const ItemBaseStats: React.FC<ItemBaseStatsProps> = ({ selectedItem, player }) => {
  if (!selectedItem) {
    return (
      <div className="text-center text-4xl text-white italic">
        Select an item to view stats.
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

  // Función para renderizar los atributos que no son de armas (es decir, otros modificadores)
  const renderAttributeProgressBars = () => {
    return attributesToDisplay.map((attrName) => {
      const value = selectedItem.modifiers?.[attrName] ?? 0; // Asegurarse de que value no sea undefined
      const isNegative = value < 0;
      const barColor = isNegative ? 'bg-red-500' : 'bg-green-500';
      const maxValue = Math.max(Math.abs(value), 50);
      
      const label = (
        <span className="text-white">
          {attrName.toUpperCase()}: {isNegative ? `-${Math.abs(value)}` : value}
        </span>
      );
  
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

  // Renderizar las estadísticas defensivas si el ítem es de tipo Armor, Boot, Helmet o Shield
  const renderDefensiveStats = () => {
    if (
      selectedItem?.type === 'armor' ||
      selectedItem?.type === 'boot' ||
      selectedItem?.type === 'helmet' ||
      selectedItem?.type === 'shield'
    ) {
      let defenseStat: number | null = null;

      if (selectedItem.type === 'armor') {
        const armor = selectedItem as Armor;
        defenseStat = armor.defense;
      } else if (selectedItem.type === 'boot') {
        const boot = selectedItem as Boot;
        defenseStat = boot.defense;
      } else if (selectedItem.type === 'helmet') {
        const helmet = selectedItem as Helmet;
        defenseStat = helmet.defense;
      } else if (selectedItem.type === 'shield') {
        const shield = selectedItem as Shield;
        defenseStat = shield.defense;
      }

      if (defenseStat !== null) {
        const attrName = "Defense";
        const isNegative = defenseStat < 0;
        const barColor = isNegative ? 'bg-red-500' : 'bg-green-500';
        const maxValue = Math.max(Math.abs(defenseStat), 100);
        const label = (
          <span className="text-white">
            {attrName.toUpperCase()}: {isNegative ? `-${Math.abs(defenseStat)}` : defenseStat}
          </span>
        );
        return (
          <div key={attrName} className="mb-4">
            <ProgressBar
              label={label}
              value={Math.abs(defenseStat)} 
              maxValue={maxValue}
              barColor={barColor}
            />
          </div> 
        );
      }
    }
    return null;
  };

  const renderWeaponStats = () => {
    if (selectedItem?.type === 'weapon') {
      const weapon = selectedItem as Weapon;
      const damageDisplay = `${weapon.die_num}D${weapon.die_faces} + ${weapon.die_modifier}`;
      return (
        <div className="mb-4">
          <div className="text-2xl">Damage: {damageDisplay}</div>
          <div className="text-2xl">Base Percentage: {weapon.base_percentage}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-[100%] p-4 bg-gray-900 rounded shadow-md text-white border-2 border-sepia">
      {renderWeaponStats()}
      {renderDefensiveStats()}
      {renderAttributeProgressBars()}
    </div>
  );
};

export default ItemBaseStats;
