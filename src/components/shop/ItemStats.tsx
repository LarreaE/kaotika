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
  const renderAttributeProgressBars = () => {
    return attributesToDisplay.map((attrName) => {
      const currentValue = totalAttributesWithCurrentEquipment[attrName] || 0;
      const newValue = newAttributes[attrName] || 0;
      const difference = differences[attrName] || 0;

      // Determinar el valor máximo para la barra de progreso
      const maxValue = Math.max(currentValue, newValue, 100);

      // Crear el label que muestra el atributo y la diferencia
      const label = `${attrName.toUpperCase()}: ${newValue} ${
        difference !== 0
          ? difference > 0
            ? `(+${difference})`
            : `(${difference})`
          : ''
      }`;

      return (
        <div key={attrName} className="mb-4">
          <ProgressBar label={label} value={newValue} maxValue={maxValue} />
        </div>
      );
    });
  };

  // Obtener el nivel mínimo requerido del objeto
  const itemMinLevel = selectedItem.min_lvl || 1;

  // Determinar el color según la comparación de niveles
  const levelColor = itemMinLevel <= player.level ? 'text-green-400' : 'text-red-400';

  return (
    <div className="p-4 bg-gray-900 rounded shadow-md text-white border-2 border-yellow-500">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-semibold">{selectedItem.name}</h3>
        <p className={`text-xl font-semibold ${levelColor}`}>Min lvl: {itemMinLevel}</p>
      </div>
      {renderAttributeProgressBars()}
    </div>
  );
};

export default ItemStats;