

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '@/DB/mongoose/config';
export default async (req: NextApiRequest, res: NextApiResponse)  => {

  const { playerEmail, merchantId ,itemId } = req.query;
  console.log("Item ID: ", itemId);

  const transferItemToPlayer = async (playerEmail: any, merchantId: any, itemId: any) => {
    try {

      const player = await mongoose.connection.collection('players').findOne({email: playerEmail})
      const collection = `merchant_${merchantId}`;
      console.log(collection);      

      const item = await mongoose.connection.collection(collection).findOneAndDelete({ name: itemId });
      console.log(item);
      
      if (!item?.value) {
        throw new Error('Item not found or already sold');
      }
  
      if (player?.gold < item.value.value) {
        throw new Error('Insufficient gold');
      }
  
      const type = `${item.type}s`
      console.log(type);
      
      console.log(player);
      
      const updatedInventory = player?.inventory[type].push(item);

      console.log(updatedInventory);

      const updatedPlayer = await mongoose.connection.collection('players').findOneAndUpdate(
        { _id: player?._id },
        {
          $set: { inventory: updatedInventory }, // adds the item
          $inc: { gold: -item.value.value }, // take out the money
        },
        { returnDocument: 'after' } //return document after
      );
  
      if (!updatedPlayer?.value) {
        throw new Error('Failed to update player inventory');
      }
  
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

    await transferItemToPlayer(playerEmail, merchantId, itemId)
      .then((updatedPlayer) => {
        console.log('Player updated:', updatedPlayer);
      })
      .catch((error) => {
        console.error('Purchase failed:', error.message);
      });
  } catch (error) {
    console.error('Error fetching item data:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
  
};