import mongoose from 'mongoose';
import { Weapon, Armor, Shield, Helmet, Ingredient, Boot, Artifact, Ring } from '@/DB/mongoose/models/models';

async function getItemFromCollection(collection:any, itemId:any) {
  try {
   
    let model;
    switch (collection) {
        case 'weapons':
            model = Weapon;
            break;
        case 'armors':
            model = Armor;
            break;
        case 'boots':
            model = Boot;
            break;
        case 'shields':
            model = Shield;
            break;
        case 'helmets':
            model = Helmet;
            break;
        case 'artifacts':
            model = Artifact;
            break;
        case 'rings':
            model = Ring;
            break;
        case 'ingredients':
            model = Ingredient;
            break;
      default:
        throw new Error('Invalid collection');
    }

    const item = await model.findById(itemId).exec();
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    return item; 
  } catch (error) {
    console.error(`Error fetching item from ${collection} collection:`, error);
    return null;
  }
}

export default getItemFromCollection;
