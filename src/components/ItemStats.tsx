import React from "react";

interface ItemStatsProps {
  selectedItem: {
    name: string;
    value: number;
    description: string;
  } | null; // Ahora puede ser nulo cuando no hay un elemento seleccionado
}

const ItemStats: React.FC<ItemStatsProps> = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <div className="text-center text-gray-500 italic">
        Select an item to view its stats.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
      <p className="text-sm text-gray-600">{selectedItem.description}</p>
      <p className="text-red-600 font-bold">Price: ${selectedItem.value}</p>
    </div>
  );
};

export default ItemStats;