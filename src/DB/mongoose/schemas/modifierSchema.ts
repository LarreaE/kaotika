import mongoose from "mongoose";

const modifierSchema = new mongoose.Schema(
    {intelligence: { type: Number },
    dexterity: { type: Number },
    constitution: { type: Number },
    insanity: { type: Number },
    charisma: { type: Number },
    strength: { type: Number },
  });

  export default mongoose.models.Modifier || mongoose.model('Modifier', modifierSchema);