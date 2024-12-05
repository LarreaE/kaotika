

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '@/DB/mongoose/config';
import {Player} from '@/DB/mongoose/models/models'
import { transformStringSingular } from '@/helpers/transformString';

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

  const { playerEmail, items } = req.query;

  const transferItemAndPayPlayer = async (player: Player, itemType: string, itemId: string) => {
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
    const itemObj: Item = JSON.parse(decodeURIComponent(itemsArr));
    console.log(itemObj);
  
    let newPlayer = player;
  
    try {
        newPlayer = await transferItemAndPayPlayer(newPlayer, itemObj.type, itemObj.name);
    } catch (error) {
        console.error('Purchase failed:', error);
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