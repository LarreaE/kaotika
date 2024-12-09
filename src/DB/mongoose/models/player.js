import mongoose, { model } from 'mongoose';
import { type } from 'os';
const Schema = mongoose.Schema;

// Modifiers Schema
const ModifiersSchema = new Schema({
  intelligence: { type: Number },
  dexterity: { type: Number },
  constitution: { type: Number },
  insanity: { type: Number },
  charisma: { type: Number },
  strength: { type: Number },
  hit_points: { type: Number, default: 0 }, // Optional, specific to certain items
});

// Base Equipment Schema
const BaseEquipmentSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  name: { type: String },
  description: { type: String },
  type: { type: String },
  image: { type: String },
  value: { type: Number },
  min_lvl: { type: Number },
  modifiers: { type: ModifiersSchema },
});

// Weapon Schema
export const WeaponSchema = new Schema({
  base_percentage: { type: Number },
  die_faces: { type: Number },
  die_modifier: { type: Number },
  die_num: { type: Number },
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
  ...BaseEquipmentSchema.obj, // Inherit base equipment fields
});

// Armor Schema
export const ArmorSchema = new Schema({
  defense: { type: Number },
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
  ...BaseEquipmentSchema.obj,
});

// Artifact Schema
export const ArtifactSchema = new Schema({
  ...BaseEquipmentSchema.obj,
});

// Recovery Effect Schema (for antidote potions)
const RecoveryEffectSchema = new Schema({
  modifiers: { type: ModifiersSchema },
  _id: { type: mongoose.Types.ObjectId, auto: true },
  name: { type: String },
  description: { type: String },
  type: { type: String },
  antidote_effects: { type: [String] },
  poison_effects: { type: [String] },
});

// Potion Schema
const PotionSchema = new Schema({
  recovery_effect: { type: RecoveryEffectSchema, default: null }, // Optional for certain potions
  duration: { type: Number, default: null }, // Optional, specific to enhancer potions
  ...BaseEquipmentSchema.obj,
});

// Shield Schema
export const ShieldSchema = new Schema({
  defense: { type: Number },
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
  ...BaseEquipmentSchema.obj,
});

// Helmet Schema
export const HelmetSchema = new Schema({
  defense: { type: Number },
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
  ...BaseEquipmentSchema.obj,
});

// Boot Schema
export const BootSchema = new Schema({
  defense: { type: Number },
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
  ...BaseEquipmentSchema.obj,
});

// Ring Schema
export const RingSchema = new Schema({
  isUnique: { type: Boolean },
  isActive: { type: Boolean },
  ...BaseEquipmentSchema.obj,
});

// Main Equipment and Potions Schema
const EquipmentSchema = new Schema({
  weapon: { type: WeaponSchema },
  armor: { type: ArmorSchema },
  artifact: { type: ArtifactSchema },
  antidote_potion: { type: PotionSchema },
  healing_potion: { type: PotionSchema },
  enhancer_potion: { type: PotionSchema },
  helmet: { type: HelmetSchema },
  shield: { type: ShieldSchema },
  boot: { type: BootSchema },
  ring: { type: RingSchema },
});

// Enhancer Potion Schema
const EnhancerPotionSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  name: { type: String },
  description: { type: String },
  type: { type: String, enum: ["enhancer"] },
  image: { type: String },
  value: { type: Number },
  duration: { type: Number },
  min_lvl: { type: Number },
  modifiers: { type: ModifiersSchema },
});

// Healing Potion Schema
const HealingPotionSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  name: { type: String },
  description: { type: String },
  type: { type: String, enum: ["healing"] },
  image: { type: String },
  value: { type: Number },
  min_lvl: { type: Number },
  modifiers: { type: ModifiersSchema },
});


const profileAttributeSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String },
  description: { type: String },
  value: { type: Number }
}, { _id: false });

const profileSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String},
  description: { type: String },
  image: { type: String },
  attributes: [profileAttributeSchema]
}, { _id: false });

const taskSchema = new Schema({
  classroomId: { type: String },
  courseWorkName: { type: String },
  grade: { type: Number },
  selectedAssignment: { type: String },
  _id: mongoose.Types.ObjectId
}, { _id: false });

const ingredientSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId },
  name: { type: String },
  description: { type: String },
  value: { type: Number },
  effects: { type: [String] },
  image: { type: String },
  type: { type: String },
});

const inventorySchema = new Schema({
  helmets: [HelmetSchema],
  weapons: [WeaponSchema],
  armors: [ArmorSchema],
  shields: [ShieldSchema],
  artifacts: [ArtifactSchema],
  boots: [BootSchema],
  rings: [RingSchema],
  ingredients: [ingredientSchema],
  antidote_potions: [PotionSchema],
  healing_potions: [HealingPotionSchema],
  enhancer_potions: [EnhancerPotionSchema]
}, { _id: false });

const playerSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String},    
  nickname: { type: String },
  email: { type: String },
  role: { type: String },       //add role
  classroom_Id: { type: String },
  level: { type: Number},
  experience: { type: Number},
  is_active: { type: Boolean, default: false},
  is_inside_tower: { type: Boolean, default: false},
  isInHall: { type: Boolean, default: false},
  fcmToken: { type: String },
  cardId: { type: String },
  avatar: { type: String },
  created_date: { type: Date},
  gold: { type: Number},
  attributes: ModifiersSchema,
  socketId: { type: String },
  location: { type: String},
  equipment: {
    weapon: WeaponSchema,
    armor: ArmorSchema,
    artifact: ArtifactSchema,
    antidote_potion: PotionSchema,
    healing_potion: HealingPotionSchema,
    enhancer_potion: EnhancerPotionSchema,
    helmet: HelmetSchema,
    shield: ShieldSchema,
    boot: BootSchema,
    ring: RingSchema
  },
  inventory: inventorySchema,
  profile: profileSchema,
  tasks: [taskSchema]
});

// Models
const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);
const Weapon = mongoose.models.Weapon || mongoose.model("Weapon", WeaponSchema);
const Armor = mongoose.models.Armor || mongoose.model("Armor", ArmorSchema);
const Artifact = mongoose.models.Artifact || mongoose.model("Artifact", ArtifactSchema);
const Potion = mongoose.models.Potion || mongoose.model("Potion", PotionSchema);
const Helmet = mongoose.models.Helmet || mongoose.model("Helmet", HelmetSchema);
const Shield = mongoose.models.Shield || mongoose.model("Shield", ShieldSchema);
const Boot = mongoose.models.Boot || mongoose.model("Boot", BootSchema);
const Ring = mongoose.models.Ring || mongoose.model("Ring", RingSchema);
const HealingPotion = mongoose.models.HealingPotion || mongoose.model("HealingPotion", HealingPotionSchema);
const EnhancerPotion = mongoose.models.EnhancerPotion || mongoose.model("EnhancerPotion", EnhancerPotionSchema);
const Equipment = mongoose.models.Equipment || mongoose.model("Equipment",EquipmentSchema);

export {
  Player,
  Weapon,
  Armor,
  Artifact,
  Potion,
  Helmet,
  Shield,
  Boot,
  Ring,
  HealingPotion,
  EnhancerPotion,
  Equipment,
}
