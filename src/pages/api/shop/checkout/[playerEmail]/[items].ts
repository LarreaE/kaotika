

import { NextApiRequest, NextApiResponse } from 'next';
import {Player} from '@/DB/mongoose/models/models'
import { transferItemToPlayer } from '@/helpers/transferItemToPlayer';
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

  const { playerEmail, items } = req.query;


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
        return res.status(500).json({error: error})
      }
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