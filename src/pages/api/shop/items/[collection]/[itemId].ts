import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '../../../../../DB/mongoose/config';
import {isDifferentDay} from '../../../../../helpers/isDifferentDay'
import { getRandomItems } from '@/helpers/getRandomItems';
import getItemFromCollection from '@/helpers/getItemFromCollection';
  
export default async (req: NextApiRequest, res: NextApiResponse)  => {

  const { itemId, collection } = req.query;
  console.log("Item ID: ", itemId);
  const collectionName = `${collection}s`
  if (!itemId || !collection) {
    return res.status(400).json({ error: "Item Id or collection is required." });
  }
  try {
    console.log(itemId);
    console.log(collectionName);
    
    const item = await getItemFromCollection(collectionName, itemId);
    
    console.log(item);
    
    if (!item) {
      console.log("Item not found");
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.status(200).json(item);   

  } catch (error) {
    console.error('Error fetching item data:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
  
};