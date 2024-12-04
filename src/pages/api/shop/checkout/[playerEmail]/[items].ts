

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '@/DB/mongoose/config';
import {Player} from '@/DB/mongoose/models/models'
import { transformStringSingular } from '@/helpers/transformString';

export default async (req: NextApiRequest, res: NextApiResponse)  => {

interface Item {
    type:string,
    name:string,
    value:number
}
interface Player {
  gold: number,
  inventory: any,
}
const decreasePurchasedGold = (player:Player, item:Item) =>{
  player.gold -= item.value;
}

  const { playerEmail, items } = req.query;

  const transferItemToPlayer = async (player: Player, itemType: string, itemId: string) => {
    try {

      const collectionName = transformStringSingular(itemType);      
      const model = mongoose.models[collectionName];

      if (!model) {
        throw new Error(`Model for collection "${collectionName}" not found.`);
      }
      console.log(model);
      const item = await model.findOne({name: itemId});      
      if (!item) {
        throw new Error('Item not found or already sold');
      }
  
      if (player?.gold < item.value.value) {
        throw new Error('Insufficient gold');
      }
  
      const type = `${item.type}s`
      console.log(type);
      
      await player?.inventory[type].push(item);
      decreasePurchasedGold(player,item);
    
      console.log('Item purchased successfully:', item.name,":", item.value );
      
      return player;
    } catch (error) {
      console.error('Error transferring item to player:', error);
      throw error;
    }
  };

  if (!items || !playerEmail) {
    return res.status(400).json({ error: "Item Id , itemtype or playerEmail is required." });
  }

  try {
    const player = await Player.findOne({ email: playerEmail });
  
    const itemsArr = Array.isArray(items) ? items[0] : items;
    const itemsObj: Item[] = JSON.parse(decodeURIComponent(itemsArr));
    console.log(itemsObj);
  
    let newPlayer = player;
  
    for (const item of itemsObj) {
      try {
        newPlayer = await transferItemToPlayer(newPlayer, item.type, item.name);
      } catch (error) {
        console.error('Purchase failed:', error);
      }
    }
  
    console.log(newPlayer);
  
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