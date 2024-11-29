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

const alchemistSchema = new Schema({
    invetory: { type: inventorySchema },
  });

export const Alchemist = mongoose.models.Alchemist || mongoose.model('Alchemist', alchemistSchema);
export const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);

