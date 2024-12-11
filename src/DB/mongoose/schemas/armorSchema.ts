// src/DB/mongoose/schemas/armorSchema.ts
import mongoose from "mongoose";

const schema = mongoose.Schema;

const armorSchema = new schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  image: { type: String },
  defense: { type: Number },
  value: { type: Number },
  modifiers: {
    intelligence: { type: Number },
    dexterity: { type: Number },
    constitution: { type: Number },
    insanity: { type: Number },
    charisma: { type: Number },
    strength: { type: Number },
  },
  min_lvl: { type: Number },
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
});
console.log(mongoose);

const Armor = mongoose.models.Armor || mongoose.model('Armor', armorSchema);

export default Armor;