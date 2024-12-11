import mongoose, { mongo } from 'mongoose';
import { ringSchema } from '../../schemas/ringSchema';
import { artifactSchema } from '../../schemas/artifactSchema';
const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    artifacts: { type: artifactSchema },
    rings: { type: ringSchema },
  });

export const jewelerSchema = new Schema({
    inventory: { type: inventorySchema },
  });

