import { NextApiRequest, NextApiResponse } from 'next';
import { SERVER_URL } from '@/constants/constants';
import '../../../DB/mongoose/config.js';
import { populatePlayer } from '@/helpers/populatePlayer';

import {
	
Weapon,
Armor,
Artifact,
Helmet,
Shield,
Boot,
Ring,
Player,
} from '@/DB/mongoose/models/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {

		const players = await Player.find()
		const wepons = await Weapon.find()
		const shields = await Shield.find()
		const helmets = await Helmet.find()
		const armors = await Armor.find()
		const boots = await Boot.find()
		const artifacts = await Artifact.find()
		const rings = await Ring.find()
		const equipment = {wepons,shields,helmets,armors,boots,artifacts,rings}
		const popul = await populatePlayer('6758704aa72354c8a3e5f395')
        res.status(200).json(popul);

	} catch (error) {
		console.error('Server error on patching player equipment:', error);
		res.status(500).json({ error: 'Server error on patching player equipment' });
	}
}