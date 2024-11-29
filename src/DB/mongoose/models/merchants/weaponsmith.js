import mongoose from 'mongoose';
import {WeaponSchema, ShieldSchema} from '../player'
const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    weapons: { type: WeaponSchema },
    shields: { type: ShieldSchema },
  });

const weaponsmithSchema = new Schema({
    invetory: { type: inventorySchema },
  });

export const Weaponsmith = mongoose.models.Weaponsmith || mongoose.model('Weaponsmith', weaponsmithSchema);

