import { Player } from "@/DB/mongoose/models/models";
import mongoose from "mongoose";
export const populatePlayer = async (playerId: string | undefined) => {

    
    const playerPopulated = await Player.findById(playerId).populate('profile').exec();
    

    // Poblamos el equipo
    await playerPopulated.equipment.populate('armor', { 'profiles': 0 });
    await playerPopulated.equipment.populate('weapon', { 'profiles': 0 });
    await playerPopulated.equipment.populate('artifact', { 'profiles': 0 });
    await playerPopulated.equipment.populate('ring', { 'profiles': 0 });
    await playerPopulated.equipment.populate('helmet', { 'profiles': 0 });
    await playerPopulated.equipment.populate('shield', { 'profiles': 0 });
    await playerPopulated.equipment.populate('boot', { 'profiles': 0 });


    // Poblamos el inventario
    await playerPopulated.inventory.populate('helmets', { 'profiles': 0 });
    await playerPopulated.inventory.populate('shields', { 'profiles': 0 });
    await playerPopulated.inventory.populate('weapons', { 'profiles': 0 });
    await playerPopulated.inventory.populate('boots', { 'profiles': 0 });
    await playerPopulated.inventory.populate('rings', { 'profiles': 0 });
    await playerPopulated.inventory.populate('armors', { 'profiles': 0 });
    await playerPopulated.inventory.populate('artifacts', { 'profiles': 0 });
    await playerPopulated.inventory.populate('ingredients', { 'profiles': 0 });

    const returnPlayer = await updateIngredientsWithQuantity(playerPopulated);

    return returnPlayer;
}

const updateIngredientsWithQuantity = async(playerPopulated) => {
    //Asignamos ingredient y añadimos atributo quantity
    const inputIngredientIds =  playerPopulated.inventory.ingredients;

    const ingredientQuantites = [];

    inputIngredientIds.forEach(ingredient => {
        const indexFound = ingredientQuantites.findIndex(item => item._id.equals(ingredient._id));
       
        if (indexFound !== -1) {
            ingredientQuantites[indexFound].qty++;
        }
        else {
            ingredientQuantites.push({_id: ingredient._id, qty: 1 });
        }
    });


    const {ingredients} = await playerPopulated.inventory.populate('ingredients', { 'profiles': 0 });

   

    const ingredientQuantitiesPopulated = ingredientQuantites.map(item => {
        const object = ingredients.filter(ingredient => item._id.equals(ingredient._id))[0];
       
        return {...object.toObject(), qty: item.qty};

    });

    const returnPlayer = {...playerPopulated.toObject()};
    returnPlayer.inventory.ingredients = ingredientQuantitiesPopulated;
   
    return returnPlayer;
}

export default populatePlayer;