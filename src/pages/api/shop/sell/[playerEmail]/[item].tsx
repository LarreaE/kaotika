import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Types } from 'mongoose'; // Asegúrate de importar Types
import { Player } from '@/DB/mongoose/models/models';
import { transformStringLowerPlural, transformStringSingular } from '@/helpers/transformString';
import populatePlayer from '@/helpers/populatePlayer';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    interface Item {
        _id: string; // Añadido para identificar por _id
        type: string;
        name: string;
        value: number;
        isUnique: boolean;
        isActive: boolean;
    }

    interface Player {
        gold: number;
        inventory: {
            [key: string]: Types.ObjectId[]; // Asumiendo que cada categoría contiene un array de ObjectId
        };
    }

    const { playerEmail, item } = req.query;

    const removeItemFromInventory = async (player: any, types: string, _id: string) => {
        const type = transformStringLowerPlural(types);
        if (player.inventory[type]) {
            console.log(`Inventario antes de la eliminación:`, player.inventory[type]);
            // Utiliza el método equals para comparar ObjectId con string
            player.inventory[type] = player.inventory[type].filter((itemId: any) => !itemId.equals(_id));
            console.log(`Inventario después de la eliminación:`, player.inventory[type]);
            console.log(`Item con ID ${_id} ha sido eliminado de ${type}.`);
        } else {
            console.log(`Categoría "${type}" no existe en el inventario.`);
        }
    };

    const payPlayer = (player: Player, item: Item) => {
        player.gold += Math.floor(item.value / 3);
        console.log(`Player gained "${Math.floor(item.value / 3)}" gold.`);
    };

    const transferItemAndPayPlayer = async (player: Player, itemType: string, itemId: string) => {
        try {
            const collectionName = transformStringSingular(itemType);
            const model = mongoose.models[collectionName];

            if (!model) {
                throw new Error(`Model for collection "${collectionName}" not found.`);
            }

            const item = await model.findById(itemId); // Buscar por _id
            console.log('Item encontrado:', item);

            if (!item) {
                throw new Error('Item not found or already sold');
            }

            if (item.isUnique) {
                console.log(`${item.name} is unique, changing isActive to add it into the available loot pool`);
                await model.updateOne({ _id: item._id }, { $set: { isActive: true } });
            }

            // Pasar _id como string
            await removeItemFromInventory(player, collectionName, item._id.toString());
            payPlayer(player, item);

            return player;

        } catch (error) {
            console.error('Error transferring selling to player:', error);
            throw error;
        }
    };

    if (!item || !playerEmail) {
        return res.status(400).json({ error: "Item or playerEmail is required." });
    }

    try {
        const player = await Player.findOne({ email: playerEmail });

        if (!player) {
            return res.status(404).json({ error: "Player not found." });
        }

        const itemsArr = Array.isArray(item) ? item[0] : item;
        const itemObj: Item = JSON.parse(decodeURIComponent(itemsArr));
        console.log(`Processing item with _id: ${itemObj._id}`);

        // Validar el formato del _id
        if (!mongoose.Types.ObjectId.isValid(itemObj._id)) {
            return res.status(400).json({ error: 'Invalid item ID format.' });
        }

        let newPlayer = player;

        try {
            newPlayer = await transferItemAndPayPlayer(newPlayer, itemObj.type, itemObj._id);
        } catch (error) {
            console.error('Sellment failed:', error);
            return res.status(500).json({ error: 'Failed to sell item.' });
        }

        // Actualizar el jugador con el inventario y oro actualizados
        const updatedPlayer = await Player.findOneAndUpdate(
            { _id: player._id },
            {
                $set: {
                    inventory: newPlayer.inventory,
                    gold: newPlayer.gold
                }
            },
            { returnDocument: 'after' }
        );
        console.log('updatedPlayer:', updatedPlayer);

        const popul = await populatePlayer(updatedPlayer._id);
        res.status(200).json(popul);

    } catch (error) {
        console.error('Error fetching item data:', error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }

};