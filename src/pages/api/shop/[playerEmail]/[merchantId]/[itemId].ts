

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '@/DB/mongoose/config';
import {Player} from '@/DB/mongoose/models/models'
import { transformStringPlural,transformStringSingular } from '@/helpers/transformString';
export default async (req: NextApiRequest, res: NextApiResponse)  => {

  const { playerEmail, merchantId ,itemId } = req.query;

  const transferItemToPlayer = async (playerEmail: string | string[], merchantId: string , itemId: string | string[]) => {
    try {

      const collectionName = transformStringSingular(merchantId);
      const model = mongoose.models[collectionName];
      if (!model) {
        throw new Error(`Model for collection "${collectionName}" not found.`);
      }
      const player = await Player.findOne({email: playerEmail})

      console.log(collectionName);
      console.log(mongoose.models);
      
      console.log("MODEL:", model);
      console.log(itemId);

      const fieldsToSearch = ['rings', 'artifacts', 'weapons','shields','helmets','armors','boots', 'ingredients'];

      const items = await model.aggregate([
        {
          $project: {
            allItems: {
              $concatArrays: [
                { $ifNull: ['$artifacts', []] },
                { $ifNull: ['$rings', []] },
                { $ifNull: ['$weapons', []] },
                { $ifNull: ['$shields', []] },
                { $ifNull: ['$helmets', []] },
                { $ifNull: ['$armors', []] },
                { $ifNull: ['$boots', []] },
                { $ifNull: ['$ingredients', []] },
              ]
            }
          }
        },
        {
          $unwind: '$allItems'
        },
        {
          $match: { 'allItems.name': itemId }
        },
        {
          $replaceRoot: { newRoot: '$allItems' }
        }
      ]);

      const item = items[0];

      console.log("ITEM:", item);
      
      if (!item) {
        throw new Error('Item not found or already sold');
      }
  
      if (player?.gold < item.value.value) {
        throw new Error('Insufficient gold');
      }
  
      const type = `${item.type}s`
      console.log(type);
      
      console.log(player.inventory);
      console.log(player.inventory[type]);
      
      await player?.inventory[type].push(item);
      


      console.log(player.inventory[type]);

      const updatedPlayer = await Player.findOneAndUpdate(
        { _id: player?._id },
        {
          $set: { inventory: player.inventory }, // adds the inventory of the modified player
          $inc: { gold: -item.value }, // take out the money
        },
        { returnDocument: 'after' } //return document after
      );
  
      console.log('Item purchased successfully:', item.value);
      res.status(200).json(updatedPlayer);

    } catch (error) {
      console.error('Error transferring item to player:', error);
      throw error;
    }
  };

  if (!itemId || !playerEmail || !merchantId) {
    return res.status(400).json({ error: "Item Id , itemtype or playerEmail is required." });
  }

  try {

    const merchantName = Array.isArray(merchantId) ? merchantId[0] : merchantId;

    await transferItemToPlayer(playerEmail, merchantName, itemId)
      .then((updatedPlayer) => {
        console.log('Player updated:', playerEmail , itemId);
        res.status(200).json(updatedPlayer)
      })
      .catch((error) => {
        console.error('Purchase failed:', error.message);
      });
  } catch (error) {
    console.error('Error fetching item data:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
  
};