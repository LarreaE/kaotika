import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '../../../../DB/mongoose/config';
import {isDifferentDay} from '../../../../helpers/isDifferentDay'
import { getRandomItems } from '@/helpers/getRandomItems';
import {transformStringPlural, transformStringSingular} from '@/helpers/transformString'
export default async (req: NextApiRequest, res: NextApiResponse)  => {

  const { merchantId } = req.query;
  console.log("MERCHANT ID: ",merchantId);
  
  const merchantName = Array.isArray(merchantId) ? merchantId[0] : merchantId;

  const updateMerchantInventory = async (merchantName: string) => {
    try {
      const db = mongoose.connection;
  

      const merchantCollections: Record<string, string[]> = {
        weaponsmith: ['weapons', 'shields'],
        armorsmith: ['helmets', 'armors', 'boots'],
        jeweler: ['artifacts', 'rings'],
        alchemist: ['ingredients',], 
      };
  
      const collectionsToFetch = merchantCollections[merchantName];
      if (!collectionsToFetch) {
        throw new Error(`Merchant type "${merchantName}" is not recognized.`);
      }
  
      //take 12 random items, splitting between total item types
      const itemsPerCollection = Math.floor(12 / collectionsToFetch.length);
      let merchantItems: any[] = [];
      
      let inventory: any = {};

      console.log("Collections to fetch: ", collectionsToFetch);

      for (const collection of collectionsToFetch) {
        console.log("Collection:", collection)
        
        const fix = transformStringPlural(collection);
        
        const randomItems = await getRandomItems(fix, itemsPerCollection);

        inventory[collection] = randomItems;
        merchantItems = merchantItems.concat(randomItems);      
      }
      
      const fix = transformStringSingular(merchantName)
      const model = mongoose.models[fix];
      if (!model) {
        throw new Error(`Model for collection "${merchantName}" not found.`);
      }
      
      const merchantCollection = db.collection(`merchant_${merchantName}`);

      // delete collection
      await model.deleteMany({});
      
      // insert new items
      await merchantCollection.insertOne(inventory);
  
      console.log(`Updated inventory for ${merchantName} with ${merchantItems.length} items.`);
    } catch (error) {
      console.error('Error updating merchant inventory:', error);
    }
  };

  if (!merchantName) {
    return res.status(400).json({ error: "Merchant name is required." });
  }

  try {
    const currentDate = new Date();
    const doc = await mongoose.connection.collection('date').findOne({})
    if (doc && doc.date) {
      const previousDate = new Date(doc.date);
      const isDayDifferent = isDifferentDay(currentDate,previousDate);
      console.log("PREVIOUS DATE: ",previousDate);

      const collection = `merchant_${merchantName}`;
      const merchantStore = mongoose.connection.collection(collection);  

      if (isDayDifferent) {
        console.log("Update Store, is ", isDayDifferent);
      }
      //update the las date to the new one
      await mongoose.connection.collection('date').updateOne(
        {},
        { $set: { date: currentDate } }
      );
        
      await updateMerchantInventory(merchantName);

      const response = await merchantStore.find({}).toArray();
      res.status(200).json(response);   
    } 
  } catch (error) {
    console.error('Error fetching merchant data:', error);
    res.status(500).json({ error: 'Failed to fetch merchant inventory' });
  }
  
};