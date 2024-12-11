import mongoose from "mongoose";

const weaponSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    type: { type: String },
    image: { type: String },
    die_faces: { type: Number },
    die_modifier: { type: Number },
    die_num: { type: Number },
    value: { type: Number },
    base_percentage: { type: Number },
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

export default mongoose.models.Weapon || mongoose.model('Weapon', weaponSchema);