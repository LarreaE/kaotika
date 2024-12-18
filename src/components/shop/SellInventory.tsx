import React from 'react';

// Tipos para los elementos en el inventario
interface InventoryItem {
  _id: string;
  min_lvl: number;
  type: string;
  image: string; // Propiedad de imagen
  qty?: number; // Solo los ingredientes tienen cantidad
}

interface Player {
  level: number;
  inventory: {
    helmets: InventoryItem[];
    weapons: InventoryItem[];
    armors: InventoryItem[];
    shields: InventoryItem[];
    artifacts: InventoryItem[];
    boots: InventoryItem[];
    rings: InventoryItem[];
    ingredients: InventoryItem[]; // Ingredientes incluyen cantidad
  };
}

// Propiedades del componente SellInventory
interface InventoryProps {
  player: Player | null; // Puede ser null si el jugador no está disponible
  GRID_NUMBER: number; // Número total de casillas en la cuadrícula
  selectItem: (item: InventoryItem | any) => void; // Función para seleccionar un ítem
}

const SellInventory: React.FC<InventoryProps> = ({ player, GRID_NUMBER, selectItem }) => {
  if (!player) return null; // Si no hay jugador, no renderizamos nada

  const renderItem = (item: InventoryItem) => (
    <div
      onClick={() => selectItem(item)}
      key={item._id}
      className="flex justify-center items-center bg-black/30 aspect-square"
    >
      <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg border-2 border-sepia">
        <img src={item.image} alt={item.type} className="w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  );

  return (
    <>
      <div
        className="grid grid-cols-8 grid-rows-8 gap-2"
        style={{ width: 'fit-content', height: 'fit-content' }}
      >
        {/* Renderizar los elementos del inventario */}
        {player.inventory.helmets?.map(renderItem)}
        {player.inventory.weapons?.map(renderItem)}
        {player.inventory.armors?.map(renderItem)}
        {player.inventory.shields?.map(renderItem)}
        {player.inventory.artifacts?.map(renderItem)}
        {player.inventory.boots?.map(renderItem)}
        {player.inventory.rings?.map(renderItem)}

        {/* Ingredientes - Manejar la cantidad */}
        {Array.isArray(player.inventory.ingredients) &&
          player.inventory.ingredients.map((ingredient) => (
            <div
              onClick={() => selectItem(ingredient)}
              key={ingredient._id}
              className="flex justify-center items-center bg-black/30 aspect-square relative"
            >
              {/* Mostrar cantidad en la esquina superior derecha */}
              <div className="text-3xl absolute top-0 right-0 bg-black bg-opacity-70 w-[30px] h-[30px] rounded-md flex items-center justify-center border border-sepia">
                <span>{ingredient.qty || 0}</span>
              </div>
              {/* Imagen del ingrediente */}
              <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg border-2 border-sepia">
                <img
                  src={ingredient.image}
                  alt={ingredient.type}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}

        {/* Rellenar las casillas vacías si es necesario */}
        {Array.from({
          length:
            GRID_NUMBER -
            (player.inventory.helmets?.length || 0) -
            (player.inventory.weapons?.length || 0) -
            (player.inventory.armors?.length || 0) -
            (player.inventory.shields?.length || 0) -
            (player.inventory.artifacts?.length || 0) -
            (player.inventory.boots?.length || 0) -
            (player.inventory.rings?.length || 0) -
            (player.inventory.ingredients?.length || 0),
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex justify-center items-center bg-black/30 aspect-square"
          >
            <div className="w-full h-full"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SellInventory;
