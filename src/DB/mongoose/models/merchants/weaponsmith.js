import mongoose from 'mongoose';
import { weaponSchema } from '../../schemas/weaponSchema';
import { shieldSchema } from '../../schemas/shieldSchema';

const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    weapons: { type: weaponSchema },
    shields: { type: shieldSchema },
  });

export const weaponsmithSchema = new Schema({
    inventory: { type: inventorySchema },
  });


