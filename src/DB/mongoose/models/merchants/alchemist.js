import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String },
    description: { type: String },
    value: { type: Number },
    effects: { type: [String] },
    image: { type: String },
    type: { type: String },
  });
// Main Equipment and Potions Schema
const inventorySchema = new Schema({
    ingredients: { type: ingredientSchema },
  });

export const alchemistSchema = new Schema({
    invetory: { type: inventorySchema },
  });
