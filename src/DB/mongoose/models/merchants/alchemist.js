import mongoose from 'mongoose';
import { ingredientSchema } from '../../schemas/ingredientSchema';

const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    ingredients: { type: ingredientSchema },
  });

export const alchemistSchema = new Schema({
    inventory: { type: inventorySchema },
  });
