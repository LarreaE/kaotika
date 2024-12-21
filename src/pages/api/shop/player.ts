
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Document } from "mongoose";
import populatePlayer from '@/helpers/populatePlayer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;
    console.log('received email in query:', email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await mongoose.connect(process.env.CONNECTION_STRING!);
        const response = await populatePlayer("6758704aa72354c8a3e5f395")

        if (response) {
            return res.status(200).json(response);
        } else {
            return res.status(404).json(response);
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
