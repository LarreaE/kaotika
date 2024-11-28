import { NextApiRequest, NextApiResponse } from 'next';
import { SERVER_URL } from '@/constants/constants';
import '../mongoose/config.js';
import {Player,Weapon,Shield,Helmet,Armor,Boot,Artifact,Ring} from '../mongoose/models/player.js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {
	    console.log("nigma");
        
        const wepons = await Weapon.find()
        const shields = await Shield.find()
        const helmets = await Helmet.find()
        const armors = await Armor.find()
        const boots = await Boot.find()
        const artifacts = await Artifact.find()
        const rings = await Ring.find()
        
        const equipment = {wepons,shields,helmets,armors,boots,artifacts,rings};
        res.status(200).json(equipment);

	} catch (error) {
		console.error('Server error on patching player equipment:', error);
		res.status(500).json({ error: 'Server error on patching player equipment' });
	}
}