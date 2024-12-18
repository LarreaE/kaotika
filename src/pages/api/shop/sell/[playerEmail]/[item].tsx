import { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Types } from 'mongoose'; 
import { Player } from '@/DB/mongoose/models/models';
import { transformStringLowerPlural, transformStringSingular } from '@/helpers/transformString';
import populatePlayer from '@/helpers/populatePlayer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    interface Item {
        _id: string; 
        type: string;
        name: string;
        value: number;
        isUnique: boolean;
        isActive: boolean;
    }

    interface Player {
        gold: number;
        inventory: {
            [key: string]: Types.ObjectId[]; 
        };
    }

    const { playerEmail, item, quantity } = req.query;

    const removeItemFromInventory = async (player: any, types: string, _id: string, quantity: number) => {
        const type = transformStringLowerPlural(types);
        if (player.inventory[type]) {
            console.log(`Inventario antes de la eliminación:`, player.inventory[type]);
            
            let removedCount = 0;
            // Eliminar las instancias del artículo en el inventario
            for (let i = 0; i < player.inventory[type].length && removedCount < quantity; i++) {
                if (player.inventory[type][i].equals(_id)) {
                    player.inventory[type].splice(i, 1);  // Eliminar artículo
                    removedCount++;
                    i--;  // Ajustar índice después de eliminar un artículo
                }
            }
            
            if (removedCount === quantity) {
                console.log(`Se han eliminado ${quantity} instancias de ${_id} del inventario.`);
            } else {
                console.log(`No se pudieron eliminar ${quantity} instancias de ${_id}. Solo se encontraron ${removedCount}.`);
            }
            console.log(`Inventario después de la eliminación:`, player.inventory[type]);
        } else {
            console.log(`Categoría "${type}" no existe en el inventario.`);
        }
    };

    const payPlayer = (player: Player, item: Item, quantity: number) => {
        const totalGold = Math.floor((item.value / 3) * quantity); // Asegurarse que es un múltiplo de 3
        console.log(`Total de oro a añadir: ${totalGold} (valor del artículo: ${item.value}, cantidad: ${quantity})`);
        player.gold += totalGold;
        console.log(`El jugador ahora tiene "${player.gold}" de oro.`);
    };

    const transferItemAndPayPlayer = async (player: Player, itemType: string, itemId: string, quantity: number) => {
        try {
            const collectionName = transformStringSingular(itemType);
            const model = mongoose.models[collectionName];

            if (!model) {
                throw new Error(`Modelo para la colección "${collectionName}" no encontrado.`);
            }

            const item = await model.findById(itemId); // Buscar por _id
            console.log('Item encontrado:', item);

            if (!item) {
                throw new Error('Item no encontrado o ya ha sido vendido');
            }

            if (item.isUnique) {
                console.log(`${item.name} es único, cambiando isActive para añadirlo al grupo de botín disponible`);
                await model.updateOne({ _id: item._id }, { $set: { isActive: true } });
            }

            // Eliminar el artículo del inventario la cantidad de veces seleccionada
            await removeItemFromInventory(player, item.type, item._id.toString(), quantity);
            payPlayer(player, item, quantity);

            return player;

        } catch (error) {
            console.error('Error al transferir la venta al jugador:', error);
            throw error;
        }
    };

    if (!item || !playerEmail) {
        return res.status(400).json({ error: "Item o playerEmail son requeridos." });
    }

    try {
        const player = await Player.findOne({ email: playerEmail });

        if (!player) {
            return res.status(404).json({ error: "Jugador no encontrado." });
        }

        const itemsArr = Array.isArray(item) ? item[0] : item;
        const itemObj: Item = JSON.parse(decodeURIComponent(itemsArr));
        console.log(`Procesando artículo con _id: ${itemObj._id}`);

        // Validar el formato del _id
        if (!mongoose.Types.ObjectId.isValid(itemObj._id)) {
            return res.status(400).json({ error: 'Formato de _id de artículo inválido.' });
        }

        const quantity = req.body.quantity || 1;  // La cantidad se pasa en el cuerpo de la solicitud
        console.log(`Cantidad de artículos seleccionados: ${quantity}`);

        let newPlayer = player;

        try {
            newPlayer = await transferItemAndPayPlayer(newPlayer, itemObj.type, itemObj._id, quantity);
        } catch (error) {
            console.error('Error en la venta:', error);
            return res.status(500).json({ error: 'No se pudo vender el artículo.' });
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

        const populatedPlayer = await populatePlayer(updatedPlayer._id);
        console.log('Jugador actualizado:', populatedPlayer);
        res.status(200).json(populatedPlayer);

    } catch (error) {
        console.error('Error al obtener datos del artículo:', error);
        res.status(500).json({ error: 'No se pudo obtener el artículo' });
    }
};
