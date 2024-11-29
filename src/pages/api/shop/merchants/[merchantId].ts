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

  const { merchantId } = req.query;

  const merchantName = Array.isArray(merchantId) ? merchantId[0] : merchantId;

  if (!merchantName) {
    return res.status(400).json({ error: "Merchant name is required." });
  }

  try {
    const currentDate = new Date();    
    const previousDate = new Date(await mongoose.connection.collection('date').find({}).toArray().date)
    const isDayDifferent = isDifferentDay(currentDate,previousDate);

    const collection = `merchant_${merchantName}`;
    const merchantStore = mongoose.connection.collection(collection);  

    if (isDayDifferent) {
      console.log("Update Store, is ", isDayDifferent);

      const wepons = await Weapon.find()
      const shields = await Shield.find()
      const helmets = await Helmet.find()
      const armors = await Armor.find()
      const boots = await Boot.find()
      const artifacts = await Artifact.find()
      const rings = await Ring.find()
      const equipment = {wepons,shields,helmets,armors,boots,artifacts,rings}
      console.log(equipment);
    
      await merchantStore.find({}).toArray();
    }
    //update the las date to the new one
    await mongoose.connection.collection('date').updateOne(
      {},
      { $set: { date: currentDate } }
    );
      
    const response = await merchantStore.find({}).toArray();
    res.status(200).json(response);    
  } catch (error) {
    console.error('Error fetching merchant data:', error);
    res.status(500).json({ error: 'Failed to fetch merchant inventory' });
  }
};