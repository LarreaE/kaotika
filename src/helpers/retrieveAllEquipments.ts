import '../DB/mongoose/config';
import {Weapon,Shield,Helmet,Armor,Boot,Artifact,Ring} from '../DB/mongoose/models/player.js'

export const retrieveAllEquipments = async() => {
    const wepons = await Weapon.find()
    const shields = await Shield.find()
    const helmets = await Helmet.find()
    const armors = await Armor.find()
    const boots = await Boot.find()
    const artifacts = await Artifact.find()
    const rings = await Ring.find()
    const equipment = {wepons,shields,helmets,armors,boots,artifacts,rings}
    return equipment;
}