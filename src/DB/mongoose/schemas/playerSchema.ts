import mongoose from 'mongoose';

// Importa los modelos (solo para garantizar que están registrados en Mongoose)
import './armorSchema';
import './weaponSchema';
import './helmetSchema';
import "./shieldSchema";
import "./artifactSchema";
import "./bootSchema";
import "./ringSchema";
import "./ingredientSchema";

export const PlayerSchema = new mongoose.Schema({
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
    helmet: { type: mongoose.Types.ObjectId, ref: 'Helmet', default: '66d99aac7518eb4990035363' },
    weapon: { type: mongoose.Types.ObjectId, ref: 'Weapon' },
    armor: { type: mongoose.Types.ObjectId, ref: 'Armor' },
    shield: { type: mongoose.Types.ObjectId, ref: 'Shield', default: '66f27c81c114335cadf45d70' },
    artifact: { type: mongoose.Types.ObjectId, ref: 'Artifact' },
    boot: { type: mongoose.Types.ObjectId, ref: 'Boot', default: '66d99a807518eb499003535f' },
    ring: { type: mongoose.Types.ObjectId, ref: 'Ring', default: '66a6d6c8dfbffe7e6503970f' },
    antidote_potion: { type: mongoose.Types.ObjectId, ref: 'PotionAntidote' },
    healing_potion: { type: mongoose.Types.ObjectId, ref: 'PotionHealing' },
    enhancer_potion: { type: mongoose.Types.ObjectId, ref: 'PotionEnhancer' }
  },
  inventory: {
    helmets: [{ type: mongoose.Types.ObjectId, ref: 'Helmet' }],
    weapons: [{ type: mongoose.Types.ObjectId, ref: 'Weapon' }],
    armors: [{ type: mongoose.Types.ObjectId, ref: 'Armor' }],
    shields: [{ type: mongoose.Types.ObjectId, ref: 'Shield' }],
    artifacts: [{ type: mongoose.Types.ObjectId, ref: 'Artifact' }],
    boots: [{ type: mongoose.Types.ObjectId, ref: 'Boot' }],
    rings: [{ type: mongoose.Types.ObjectId, ref: 'Ring' }],
    // antidote_potions: [{ type: mongoose.Types.ObjectId, ref: 'PotionAntidote' }],
    // healing_potions: [{ type: mongoose.Types.ObjectId, ref: 'PotionHealing' }],
    // enhancer_potions: [{ type: mongoose.Types.ObjectId, ref: 'PotionEnhancer' }],
    ingredients: [{ type: mongoose.Types.ObjectId, ref: 'Ingredient' }]
  },
  tasks: [{ type: Object }],
}, { timestamps: true }); // Agrega campos createdAt y updatedAt automáticamente
