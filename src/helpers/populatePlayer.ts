import { Player } from "@/DB/mongoose/models/models";
import mongoose, { Document } from "mongoose";

// Definir una interfaz para los ingredientes y otros documentos
interface Ingredient extends Document {
  _id: mongoose.Types.ObjectId;
  // Puedes agregar otras propiedades aquí si es necesario
}

interface Equipment {
  armor: mongoose.Document | null;
  weapon: mongoose.Document | null;
  artifact: mongoose.Document | null;
  ring: mongoose.Document | null;
  helmet: mongoose.Document | null;
  shield: mongoose.Document | null;
  boot: mongoose.Document | null;
  populate: (path: string, select?: object) => Promise<void>;
}

interface Inventory {
  helmets: mongoose.Document[];
  shields: mongoose.Document[];
  weapons: mongoose.Document[];
  boots: mongoose.Document[];
  rings: mongoose.Document[];
  armors: mongoose.Document[];
  artifacts: mongoose.Document[];
  ingredients: Ingredient[]; // Aseguramos que ingredientes son del tipo Ingredient
  populate: (path: string, select?: object) => Promise<void>;
}

interface PlayerPopulated extends mongoose.Document {
  profile: mongoose.Document | null;
  equipment: Equipment;
  inventory: Inventory;
}

export const populatePlayer = async (playerId: string | undefined): Promise<PlayerPopulated | null> => {
  const playerPopulated = await Player.findById(playerId)
    .populate('profile')
    .exec() as PlayerPopulated | null;

  if (!playerPopulated) return null;

  // Poblamos el equipo
  await playerPopulated.equipment.populate('armor', { profiles: 0 });
  await playerPopulated.equipment.populate('weapon', { profiles: 0 });
  await playerPopulated.equipment.populate('artifact', { profiles: 0 });
  await playerPopulated.equipment.populate('ring', { profiles: 0 });
  await playerPopulated.equipment.populate('helmet', { profiles: 0 });
  await playerPopulated.equipment.populate('shield', { profiles: 0 });
  await playerPopulated.equipment.populate('boot', { profiles: 0 });

  // Poblamos el inventario
  await playerPopulated.inventory.populate('helmets', { profiles: 0 });
  await playerPopulated.inventory.populate('shields', { profiles: 0 });
  await playerPopulated.inventory.populate('weapons', { profiles: 0 });
  await playerPopulated.inventory.populate('boots', { profiles: 0 });
  await playerPopulated.inventory.populate('rings', { profiles: 0 });
  await playerPopulated.inventory.populate('armors', { profiles: 0 });
  await playerPopulated.inventory.populate('artifacts', { profiles: 0 });
  await playerPopulated.inventory.populate('ingredients', { profiles: 0 });

  const returnPlayer = await updateIngredientsWithQuantity(playerPopulated);

  return returnPlayer;
};

const updateIngredientsWithQuantity = async (playerPopulated: PlayerPopulated): Promise<PlayerPopulated> => {
  // Asignamos ingredient y añadimos atributo quantity
  const inputIngredientIds = playerPopulated.inventory.ingredients;

  const ingredientQuantites: { _id: mongoose.Types.ObjectId; qty: number }[] = [];

  inputIngredientIds.forEach((ingredient) => {
    const indexFound = ingredientQuantites.findIndex((item) => item._id.equals(ingredient._id));

    if (indexFound !== -1) {
      ingredientQuantites[indexFound].qty++;
    } else {
      ingredientQuantites.push({ _id: ingredient._id, qty: 1 });
    }
  });

  // Aquí, estamos usando `populate` correctamente para poblar los ingredientes
  const { ingredients } = playerPopulated.inventory; // Esto ya está poblado por el `populate`

  const ingredientQuantitiesPopulated = ingredientQuantites.map((item) => {
    // Encontramos el ingrediente correspondiente usando `find`
    const object = ingredients.find((ingredient) => item._id.equals(ingredient._id));

    if (!object) {
      throw new Error(`Ingredient not found for _id: ${item._id}`);
    }

    return { ...object.toObject(), qty: item.qty };
  });

  const returnPlayer = { ...playerPopulated.toObject() };
  returnPlayer.inventory.ingredients = ingredientQuantitiesPopulated;

  return returnPlayer;
};

export default populatePlayer;
