import React from 'react';
import ProgressBar from '../ProgressBar';

import { Weapon } from '../../_common/interfaces/Weapon';
import { Armor } from '../../_common/interfaces/Armor';
import { Boot } from '@/_common/interfaces/Boot';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Ring } from '@/_common/interfaces/Ring';
import { Shield } from '@/_common/interfaces/Shield';
import { Modifier } from '@/_common/interfaces/Modifier';
import { Player } from '@/_common/interfaces/Player';

type Item = Weapon | Armor | Boot | Helmet | Artifact | Ring | Shield;

interface ItemStatsProps {
  selectedItem: Item | null;
  player: Player | undefined;
}

const ItemStats: React.FC<ItemStatsProps> = ({ selectedItem, player }) => {
  if (!selectedItem) {
    return (
      <div className="text-center text-gray-500 italic">
        Selecciona un elemento para ver sus estadísticas.
      </div>
    );
  }

  // Lista de atributos a mostrar
  const attributesToDisplay: (keyof Modifier)[] = [
    'intelligence',
    'dexterity',
    'constitution',
    'insanity',
    'charisma',
    'strength',
  ];

  // Lista de tipos de equipamiento a incluir en los cálculos (excluyendo las pociones)
  const equipmentTypesToInclude: (keyof Player['equipment'])[] = [
    'weapon',
    'armor',
    'boot',
    'helmet',
    'artifact',
    'ring',
    'shield',
    // Asegúrate de que 'potion' o cualquier otro tipo no deseado no esté incluido aquí
  ];

  // Función para calcular los atributos totales del jugador, excluyendo las pociones
  const calculateTotalAttributes = (player: Player): Modifier => {
    const totalAttributes: Modifier = {};

    // Inicializar los atributos con los valores base del jugador
    for (const attr of attributesToDisplay) {
      totalAttributes[attr] = player.attributes[attr] || 0;
    }

    // Sumar los modificadores de los ítems equipados relevantes
    for (const equipmentType of equipmentTypesToInclude) {
      const item = player.equipment[equipmentType];
      if (item && 'modifiers' in item && item.modifiers) {
        const modifiers = item.modifiers as Modifier;
        for (const attrKey in modifiers) {
          if (
            attributesToDisplay.includes(attrKey as keyof Modifier) &&
            typeof modifiers[attrKey as keyof Modifier] === 'number'
          ) {
            totalAttributes[attrKey as keyof Modifier] += modifiers[attrKey as keyof Modifier] || 0;
          }
        }
      }
    }

    return totalAttributes;
  };

  // Obtener los atributos totales actuales del jugador
  const totalAttributesWithCurrentEquipment = calculateTotalAttributes(player);

  // Obtener el ítem actualmente equipado del mismo tipo que el seleccionado
  const getCurrentlyEquippedItem = (): Item | null => {
    const itemType = selectedItem.type.toLowerCase(); // Convertir a minúsculas
    return player.equipment[itemType as keyof Player['equipment']] || null;
  };

  const currentlyEquippedItem = getCurrentlyEquippedItem();

  // Crear una función que calcule los atributos manualmente
  const calculateAttributesManually = (): {
    newAttributes: Modifier;
    differences: { [key in keyof Modifier]?: number };
  } => {
    // Inicializar los atributos sin el ítem actualmente equipado
    const attributesWithoutCurrentItem: Modifier = { ...totalAttributesWithCurrentEquipment };

    // Restar los modificadores del ítem actualmente equipado del mismo tipo
    if (currentlyEquippedItem && currentlyEquippedItem.modifiers) {
      const modifiers = currentlyEquippedItem.modifiers as Modifier;
      for (const attrKey in modifiers) {
        if (
          attributesToDisplay.includes(attrKey as keyof Modifier) &&
          typeof modifiers[attrKey as keyof Modifier] === 'number'
        ) {
          attributesWithoutCurrentItem[attrKey as keyof Modifier] -= modifiers[attrKey as keyof Modifier] || 0;
        }
      }
    }

    // Agregar los modificadores del ítem seleccionado
    if (selectedItem.modifiers) {
      const modifiers = selectedItem.modifiers as Modifier;
      for (const attrKey in modifiers) {
        if (
          attributesToDisplay.includes(attrKey as keyof Modifier) &&
          typeof modifiers[attrKey as keyof Modifier] === 'number'
        ) {
          attributesWithoutCurrentItem[attrKey as keyof Modifier] += modifiers[attrKey as keyof Modifier] || 0;
        }
      }
    }

    // Calcular las diferencias con respecto a los atributos totales actuales
    const differences: { [key in keyof Modifier]?: number } = {};
    for (const attr of attributesToDisplay) {
      const newValue = attributesWithoutCurrentItem[attr] || 0;
      const currentValue = totalAttributesWithCurrentEquipment[attr] || 0;
      const difference = newValue - currentValue;
      differences[attr] = difference;
    }

    return {
      newAttributes: attributesWithoutCurrentItem,
      differences,
    };
  };

  const { newAttributes, differences } = calculateAttributesManually();

  // Función para renderizar las barras de progreso de los atributos
    // Función para renderizar las barras de progreso de los atributos
    const renderAttributeProgressBars = () => {
      return attributesToDisplay.map((attrName) => {
        const currentValue = totalAttributesWithCurrentEquipment[attrName] || 0;
        const newValue = newAttributes[attrName] || 0;
        const difference = differences[attrName] || 0;
    
        // Determinar el valor máximo para la barra de progreso
        const maxValue = Math.max(currentValue, newValue, 400);
    
        // Determinar la flecha y el color
        const arrow = difference > 0 ? '↑' : difference < 0 ? '↓' : '';
        const arrowColor = difference > 0 ? 'text-green-500' : difference < 0 ? 'text-red-500' : 'text-white';
    
        // Crear el label que muestra el atributo y la diferencia
        const label = (
          <span className="text-white">
            {attrName.toUpperCase()}: {newValue} 
            {difference !== 0
              ? difference > 0
                ? ` (+${difference})`
                : ` (${
                difference})`
              : ''}
              <span className={arrowColor}>{arrow}</span>
          </span>
        );
    
        return (
          <div key={attrName} className="mb-4">
            <div className="flex items-center">
              {/* Renderiza la barra de progreso */}
              <ProgressBar label={label} value={newValue} maxValue={maxValue} />
            </div>
          </div>
        );
      });
    };
    
  


  // Obtener el nivel mínimo requerido del objeto
  const itemMinLevel = selectedItem.min_lvl || 1;

  // Determinar el color según la comparación de niveles
  const levelColor = itemMinLevel <= player.level ? 'text-green-400' : 'text-red-400';

  const renderDefensiveStats = () => {
    if (
      selectedItem?.type === 'armor' ||
      selectedItem?.type === 'boot' ||
      selectedItem?.type === 'helmet' ||
      selectedItem?.type === 'shield'
    ) {
      const currentlyEquippedItem = getCurrentlyEquippedItem();
      let currentItemDefense = 0;
  
      if (
        currentlyEquippedItem &&
        (currentlyEquippedItem.type === 'armor' ||
          currentlyEquippedItem.type === 'boot' ||
          currentlyEquippedItem.type === 'helmet' ||
          currentlyEquippedItem.type === 'shield')
      ) {
        currentItemDefense = (currentlyEquippedItem as any).defense || 0;
      }
  
      let selectedItemDefense = 0;
      if (selectedItem.type === 'armor') {
        selectedItemDefense = (selectedItem as Armor).defense;
      } else if (selectedItem.type === 'boot') {
        selectedItemDefense = (selectedItem as Boot).defense;
      } else if (selectedItem.type === 'helmet') {
        selectedItemDefense = (selectedItem as Helmet).defense;
      } else if (selectedItem.type === 'shield') {
        selectedItemDefense = (selectedItem as Shield).defense;
      }
  
      const totalCurrentDefense = equipmentTypesToInclude.reduce((total, equipmentType) => {
        const item = player?.equipment[equipmentType];
        if (
          item &&
          (item.type === 'armor' || item.type === 'boot' || item.type === 'helmet' || item.type === 'shield')
        ) {
          total += (item as any).defense || 0;
        }
        return total;
      }, 0);
  
      const totalNewDefense = totalCurrentDefense - currentItemDefense + selectedItemDefense;
  
      // Calcular la diferencia
      const defenseDifference = totalNewDefense - totalCurrentDefense;
  
      // Determinar la flecha y el color
      const arrow = defenseDifference > 0 ? '↑' : (defenseDifference < 0 ? '↓' : '');
      const arrowColor = defenseDifference > 0 ? 'text-green-500' : (defenseDifference < 0 ? 'text-red-500' : 'text-white');
  
      // Crear el label con el texto blanco y la flecha
      const label = (
        <span className="text-white">
          DEFENSE: {totalNewDefense} 
          {defenseDifference !== 0 
            ? <>
                {defenseDifference > 0 
                  ? ` (+${defenseDifference})` 
                  : ` (${defenseDifference})`}
              </>
            : ''}
            <span className={arrowColor}>{arrow}</span> 
        </span>
      );
  
      const maxValue = Math.max(totalCurrentDefense, totalNewDefense, 300);
      const barColor = defenseDifference >= 0 ? 'bg-green-500' : 'bg-red-500';
  
      return (
        <div className="mb-4">
          <ProgressBar label={label} value={totalNewDefense} maxValue={maxValue} barColor={barColor} />
        </div>
      );
    }
    return null;
  };

  const renderWeaponStats = () => {
    if (selectedItem?.type === 'weapon') {
      const weapon = selectedItem as Weapon;
  
      // Cálculo del daño del nuevo ítem
      const selectedDamageValue = weapon.die_num * weapon.die_faces + weapon.die_modifier;
      const selectedDamage = `${weapon.die_num}D${weapon.die_faces} + ${weapon.die_modifier}`;
  
      const currentlyEquippedItem = getCurrentlyEquippedItem();
      let currentDamageValue = 0;
      let currentDamage = '0D0 + 0';
  
      if (currentlyEquippedItem?.type === 'weapon') {
        const equippedWeapon = currentlyEquippedItem as Weapon;
        // Cálculo del daño del ítem equipado
        currentDamageValue = equippedWeapon.die_num * equippedWeapon.die_faces + equippedWeapon.die_modifier;
        currentDamage = `${equippedWeapon.die_num}D${equippedWeapon.die_faces} + ${equippedWeapon.die_modifier}`;
      }
  
      // Comparación de daño (calculando la diferencia)
      const damageDifference = selectedDamageValue - currentDamageValue;
      const damageArrow = damageDifference > 0 ? '↑' : (damageDifference < 0 ? '↓' : '');
      const damageColor = damageDifference > 0 ? 'text-green-500' : (damageDifference < 0 ? 'text-red-500' : 'text-white');
  
      // Comparación del porcentaje base
      const selectedBasePercentage = weapon.base_percentage;
      const currentlyEquippedBasePercentage = currentlyEquippedItem && 'base_percentage' in currentlyEquippedItem 
        ? (currentlyEquippedItem as Weapon).base_percentage 
        : 0;
      
      const basePercentageDifference = selectedBasePercentage - currentlyEquippedBasePercentage;
      const basePercentageArrow = basePercentageDifference > 0 ? '↑' : (basePercentageDifference < 0 ? '↓' : '');
      const basePercentageColor = basePercentageDifference > 0 ? 'text-green-500' : (basePercentageDifference < 0 ? 'text-red-500' : 'text-white');
  
      return (
        <div className="mb-4">
          {/* Mostrar el daño comparado */}
          <div className="text-2xl">
            <div className="flex items-center">
              <div>{`Damage: ${currentDamage} -> ${selectedDamage}`}</div>
              {damageArrow && <span className={damageColor}>{damageArrow}</span>}
            </div>
          </div>
  
          {/* Mostrar el porcentaje base comparado */}
          <div className="text-2xl">
            <div className="flex items-center">
              <div>{`Base Percentage: ${currentlyEquippedBasePercentage}% -> ${selectedBasePercentage}%`}</div>
              {basePercentageArrow && <span className={basePercentageColor}>{basePercentageArrow}</span>}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  
  



  return (
    <div className="p-4 w-full bg-gray-900 rounded shadow-md text-white border-2 border-sepia">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-semibold">{selectedItem.name}</h3>
        <p className={`text-xl font-semibold ${levelColor}`}>Min lvl: {itemMinLevel}</p>
      </div>
      {renderDefensiveStats()}
      {renderWeaponStats()}
      {renderAttributeProgressBars()}
    </div>
  );
};

export default ItemStats;