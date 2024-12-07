import mongoose, { mongo } from 'mongoose';
import {RingSchema, ArtifactSchema} from '../player'
const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    artifacts: { type: ArtifactSchema },
    rings: { type: RingSchema },
  });

const jewelerSchema = new Schema({
    invetory: { type: inventorySchema },
  });

export const Jeweler = mongoose.models.Jeweler || mongoose.model('Jeweler', jewelerSchema, 'merchant_jeweler');
