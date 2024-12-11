
import mongoose from '@/DB/mongoose/config';
import { decreasePurchasedGold } from "./decreasePurchaseGold";
import { transformStringSingular } from "./transformString";

interface Player {
    gold: number,
    inventory: any,
}
  
export const transferItemToPlayer = async (player: Player, itemType: string, itemId: string) => {
    try {

      const collectionName = transformStringSingular(itemType);      
      const model = mongoose.models[collectionName];

      if (!model) {
        throw new Error(`Model for collection "${collectionName}" not found.`);
      }
      const item = await model.findOne({name: itemId});      
      if (!item) {
        throw new Error('Item not found or already sold');
      }
  
      if (player?.gold < item.value.value) {
        throw new Error('Insufficient gold');
      }
  
      const type = `${item.type}s`
      console.log(type);
      
      await player.inventory[type].push(item);
      decreasePurchasedGold(player,item);
    
      console.log('Item purchased successfully:', item.name,":", item.value );
      
      return player;
    } catch (error) {
      console.error('Error transferring item to player:', error);
      throw error;
    }
};