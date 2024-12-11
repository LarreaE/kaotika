import mongoose, { Schema } from "mongoose";

// Importa los modelos (solo para garantizar que están registrados en Mongoose)
import "./armorSchema";
import "./weaponSchema";
import "./helmetSchema";
import "./shieldSchema";
import "./artifactSchema";
import "./bootSchema";
import "./ringSchema";
import "./ingredientSchema";

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  gold: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
  created_date: { type: Date, default: Date.now },
  profile: { type: Object },
  attributes: { type: Object, required: true },
  classroom_id: { type: String, default: null },
  equipment: {
    helmet: { type: Schema.Types.ObjectId, ref: "Helmet", default: "66d99aac7518eb4990035363" },
    weapon: { type: Schema.Types.ObjectId, ref: "Weapon" },
    armor: { type: Schema.Types.ObjectId, ref: "Armor" },
    shield: { type: Schema.Types.ObjectId, ref: "Shield", default: "66f27c81c114335cadf45d70" },
    artifact: { type: Schema.Types.ObjectId, ref: "Artifact" },
    boot: { type: Schema.Types.ObjectId, ref: "Boot", default: "66d99a807518eb499003535f" },
    ring: { type: Schema.Types.ObjectId, ref: "Ring", default: "66a6d6c8dfbffe7e6503970f" },
    // antidote_potion: { type: Schema.Types.ObjectId, ref: "PotionAntidote" },
    // healing_potion: { type: Schema.Types.ObjectId, ref: "PotionHealing" },
    // enhancer_potion: { type: Schema.Types.ObjectId, ref: "PotionEnhancer" }
  },
  inventory: {
    helmets: [{ type: Schema.Types.ObjectId, ref: "Helmet" }],
    weapons: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
    armors: [{ type: Schema.Types.ObjectId, ref: "Armor" }],
    shields: [{ type: Schema.Types.ObjectId, ref: "Shield" }],
    artifacts: [{ type: Schema.Types.ObjectId, ref: "Artifact" }],
    boots: [{ type: Schema.Types.ObjectId, ref: "Boot" }],
    rings: [{ type: Schema.Types.ObjectId, ref: "Ring" }],
    // antidote_potions: [{ type: Schema.Types.ObjectId, ref: "PotionAntidote" }],
    // healing_potions: [{ type: Schema.Types.ObjectId, ref: "PotionHealing" }],
    // enhancer_potions: [{ type: Schema.Types.ObjectId, ref: "PotionEnhancer" }],
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }]
  },
  tasks: [{ type: Object }],
}, { timestamps: true }); // Agrega campos createdAt y updatedAt automáticamente

export default mongoose.models.Player || mongoose.model("Player", PlayerSchema);