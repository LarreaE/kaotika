import mongoose from '@/DB/mongoose/config';
import { Player } from '@/DB/mongoose/models/models';
import populatePlayer from '@/helpers/populatePlayer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await fetch(`https://kaotika-server.fly.dev/players/email/${email}`);
    const populated = await populatePlayer('6758704aa72354c8a3e5f395');
    
    const data = await response.json();
    if (response.status === 200) {
      return res.status(200).json(populated);
    }
    if (response.status === 404) {
      return res.status(404).json(data);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}