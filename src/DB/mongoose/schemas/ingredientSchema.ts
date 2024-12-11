import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  value: { type: Number },
  effects: { type: Array, items: { type: String } },
  image: { type: String },
  type: { type: String },
  quantity: { type: Number },
});

export default mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);