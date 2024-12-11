import mongoose from "mongoose";
import {armorSchema} from "../schemas/armorSchema";
import { artifactSchema } from "../schemas/artifactSchema";
import { bootSchema } from "../schemas/bootSchema";
import { helmetSchema } from "../schemas/helmetSchema";
import { ingredientSchema } from "../schemas/ingredientSchema";
import { ringSchema } from "../schemas/ringSchema";
import { shieldSchema } from "../schemas/shieldSchema";
import { weaponSchema } from "../schemas/weaponSchema";
import { modifierSchema } from "../schemas/modifierSchema";
import { PlayerSchema } from "../schemas/playerSchema";
import {armorsmithSchema} from "./merchants/armorsmith"
import {jewelerSchema} from "./merchants/jeweler";
import {alchemistSchema} from "./merchants/alchemist";
import {weaponsmithSchema} from "./merchants/weaponsmith";
import {dateSchema} from "./date"

//merchants
const Armorsmith = mongoose.models.Armorsmith || mongoose.model('Armorsmith', armorsmithSchema, 'merchant_armorsmith');
const Jeweler = mongoose.models.Jeweler || mongoose.model('Jeweler', jewelerSchema, 'merchant_jeweler');
const Alchemist = mongoose.models.Alchemist || mongoose.model('Alchemist', alchemistSchema, 'merchant_alchemist');
const Weaponsmith = mongoose.models.Weaponsmith || mongoose.model('Weaponsmith', weaponsmithSchema, 'merchant_weaponsmith');
//date
const DateModel = mongoose.models.DateModel || mongoose.model('DateModel', dateSchema, 'date');
//items
const Armor = mongoose.models.Armor || mongoose.model('Armor', armorSchema);
const Artifact = mongoose.models.Artifact || mongoose.model("Artifact", artifactSchema);
const Boot = mongoose.models.Boot || mongoose.model('Boot', bootSchema);
const Helmet = mongoose.models.Helmet || mongoose.model('Helmet', helmetSchema);
const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);
const Ring = mongoose.models.Ring || mongoose.model('Ring', ringSchema);
const Shield = mongoose.models.Shield || mongoose.model('Shield', shieldSchema);
const Weapon = mongoose.models.Weapon || mongoose.model('Weapon', weaponSchema);
//mods
const Modifier = mongoose.models.Modifier || mongoose.model('Modifier', modifierSchema);

//player
const Player = mongoose.models.Player || mongoose.model("Player", PlayerSchema);

export {
    Armorsmith,
    Jeweler,
    Alchemist,
    Weaponsmith,
    DateModel,
    Armor,
    Artifact,
    Boot,
    Helmet,
    Ingredient,
    Ring,
    Shield,
    Weapon,
    Modifier,
    Player,
}