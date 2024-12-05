

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '@/DB/mongoose/config';
import {Player} from '@/DB/mongoose/models/models'
import { transformStringLowerPlural, transformStringPlural, transformStringSingular } from '@/helpers/transformString';

export default async (req: NextApiRequest, res: NextApiResponse)  => {

interface Item {
    type:string,
    name:string,
    value:number,
    isUnique: boolean,
}
interface Player {
  gold: number,
}

  const { playerEmail, item } = req.query;

  const removeItemFromInventory = (player: any, types:string, name:string) => {
    const type = transformStringLowerPlural(types);
    if (player.inventory[type]) {
        player.inventory[type] = player.inventory[type].filter((item: { name: string; }) => item.name !== name);
        console.log(`Item with ID ${name} has been removed from ${type}.`);
    } else {
        console.log(`Category "${type}" does not exist in the inventory.`);
    }
  }

  const payPlayer = (player: Player, item:Item) => {
      player.gold += (Math.floor(item.value/3))
      console.log(`Player gained "${Math.floor(item.value/3)}" gold.`);
  }

  const transferItemAndPayPlayer = async (player: Player, itemType: string, itemId: string) => {
    try {

      const collectionName = transformStringSingular(itemType);      
      const model = mongoose.models[collectionName];

      if (!model) {
        throw new Error(`Model for collection "${collectionName}" not found.`);
      }
      console.log("MODEL: ", model);
      const item = await model.findOne({name: itemId});
      
      if (!item) {
        throw new Error('Item not found or already sold');
      }
      
      removeItemFromInventory(player,collectionName,itemId);      
      payPlayer(player, item);

      return player;

    } catch (error) {
      console.error('Error transferring item to player:', error);
      throw error;
    }
  };

  if (!item || !playerEmail) {
    return res.status(400).json({ error: "Item or playerEmail is required." });
  }

  try {
    const player = await Player.findOne({ email: playerEmail });
  
    const itemsArr = Array.isArray(item) ? item[0] : item;
    const itemObj: Item = JSON.parse(decodeURIComponent(itemsArr));
    console.log(itemObj.name);
  
    let newPlayer = player;
  
    try {
        newPlayer = await transferItemAndPayPlayer(newPlayer, itemObj.type, itemObj.name);
    } catch (error) {
        console.error('Sellment failed:', error);
    }
    
    //patch player with updated inventory
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: player?._id },
      {
        $set: {
          inventory: newPlayer.inventory,
          gold: newPlayer.gold //set gold
        }
      },
      { returnDocument: 'after' }
    );
  
    res.status(200).json(updatedPlayer);
  
  } catch (error) {
    console.error('Error fetching item data:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
  
  
};