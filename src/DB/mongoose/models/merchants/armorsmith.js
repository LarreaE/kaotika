import mongoose from 'mongoose';
import {helmetSchema} from '../../schemas/helmetSchema';
import { armorSchema } from '../../schemas/armorSchema';
import {bootSchema} from '../../schemas/bootSchema';
const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    helmets: { type: helmetSchema },
    armors: { type: armorSchema },
    boots: { type: bootSchema },
  });

export const armorsmithSchema = new Schema({
    invetory: { type: inventorySchema },
  });

