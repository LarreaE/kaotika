import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '@/DB/mongoose/config';
import { Player } from '@/DB/mongoose/models/models';
import { transformStringSingular } from '@/helpers/transformString';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  interface Item {
    type: string;
    name: string;
    value: number;
    quantity: number;
  }

  const { playerEmail, items } = req.query;

  if (!items || !playerEmail) {
    return res.status(400).json({ error: "Item Id, item type, or playerEmail is required." });
  }

  try {
    const player = await Player.findOne({ email: playerEmail });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const itemsArr = Array.isArray(items) ? items[0] : items;
    const itemsObj: Item[] = JSON.parse(decodeURIComponent(itemsArr));
    console.log("Items received:", itemsObj);

    let totalCost = 0;
    const inventoryUpdates: { [key: string]: string[] } = {};

    for (const item of itemsObj) {
      const collectionName = transformStringSingular(item.type);
      const model = mongoose.models[collectionName];

      if (!model) {
        return res.status(400).json({ error: `Model for collection "${collectionName}" not found.` });
      }

      const dbItem = await model.findOne({ name: item.name });

      if (!dbItem) {
        return res.status(404).json({ error: `Item "${item.name}" not found.` });
      }

      console.log(`Processing item: ${item.name}, Quantity: ${item.quantity}, Unit price: ${dbItem.value}`);

      const totalItemCost = dbItem.value * item.quantity;
      totalCost += totalItemCost;

      if (player.gold < totalCost) {
        return res.status(400).json({ error: `Insufficient gold to purchase "${item.name}".` });
      }

      const typeKey = `${dbItem.type}s`;
      if (!inventoryUpdates[typeKey]) {
        inventoryUpdates[typeKey] = [];
      }
      for (let i = 0; i < item.quantity; i++) {
        inventoryUpdates[typeKey].push(dbItem._id.toString());
      }

      console.log(`Added ${item.quantity} of ${item.name} to inventory.`);
    }

    if (player.gold < totalCost) {
      return res.status(400).json({ error: 'Insufficient gold for all items.' });
    }

    for (const [type, ids] of Object.entries(inventoryUpdates)) {
      if (!player.inventory[type]) {
        player.inventory[type] = [];
      }
      player.inventory[type] = player.inventory[type].concat(ids);
    }

    player.gold -= totalCost;

    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: player._id },
      {
        $set: {
          inventory: player.inventory,
          gold: player.gold,
        },
      },
      { new: true }
    );

    console.log("Purchase successful. Updated player:", updatedPlayer);
    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to process items.' });
  }
};
