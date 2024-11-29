import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from '../../../../DB/mongoose/config';
import {isDifferentDay} from '../../../../helpers/isDifferentDay'
import { retrieveAllEquipments } from '@/helpers/retrieveAllEquipments';
import { getRandomItems } from '@/helpers/getRandomItems';

import {
  Alchemist,
  Armorsmith,
  Jeweler,
  Weaponsmith,
  Player,
  Weapon,
  Armor,
  Artifact,
  Potion,
  Helmet,
  Shield,
  Boot,
  Ring,
  HealingPotion,
  EnhancerPotion,
  Equipment} from '@/DB/mongoose/models/models';
  
export default async (req: NextApiRequest, res: NextApiResponse)  => {

  console.log(req.query);
  
  const { merchantId } = req.query;
  console.log("MERCHANT IDDDDDDDDDDD: ",merchantId);
  
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
  
      for (const collection of collectionsToFetch) {
        console.log("Collections to fetch: ", collectionsToFetch);
        console.log("Collection:", collection)
        
        const randomItems = await getRandomItems(collection, itemsPerCollection);
        merchantItems = merchantItems.concat(randomItems);
        console.log(merchantItems); 
      }
      const merchantCollection = db.collection(`merchant_${merchantName}`);

      // delete collection
      await merchantCollection.deleteMany({});

      // insert new items
      await merchantCollection.insertMany(merchantItems);
  
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
    const previousDate = new Date(await mongoose.connection.collection('date').find({}).date)
    const isDayDifferent = isDifferentDay(currentDate,previousDate);

    const collection = `merchant_${merchantName}`;
    const merchantStore = mongoose.connection.collection(collection);  

    if (isDayDifferent) {
      console.log("Update Store, is ", isDayDifferent);
    
      await merchantStore.find({}).toArray();
    }
    //update the las date to the new one
    await mongoose.connection.collection('date').updateOne(
      {},
      { $set: { date: currentDate } }
    );
      
    updateMerchantInventory(merchantName);

    const response = await merchantStore.find({}).toArray();
    res.status(200).json(response);    
  } catch (error) {
    console.error('Error fetching merchant data:', error);
    res.status(500).json({ error: 'Failed to fetch merchant inventory' });
  }
  
};