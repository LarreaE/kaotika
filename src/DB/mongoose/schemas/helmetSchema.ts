import mongoose from "mongoose";

const helmetSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  type: { type: String },
  value: { type: Number },
  defense: { type: Number },
  image: { type: String },
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

export default mongoose.models.Helmet || mongoose.model('Helmet', helmetSchema);