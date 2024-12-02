import mongoose from 'mongoose';
import {HelmetSchema, ArmorSchema, BootSchema} from '../player'
const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    helmets: { type: HelmetSchema },
    armors: { type: ArmorSchema },
    boots: { type: BootSchema },
  });

const armorsmithSchema = new Schema({
    invetory: { type: inventorySchema },
  });

export const Armorsmith = mongoose.models.Armorsmith || mongoose.model('Armorsmith', armorsmithSchema, 'merchant_armorsmith');
