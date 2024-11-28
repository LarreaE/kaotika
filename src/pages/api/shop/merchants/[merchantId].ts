import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import mongoose from '../../../../DB/mongoose/config';

export default async (req: NextApiRequest, res: NextApiResponse)  => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { merchantId } = req.query;

  const merchantName = Array.isArray(merchantId) ? merchantId[0] : merchantId;

  if (!merchantName) {
    return res.status(400).json({ error: "Merchant name is required." });
  }

  try {
    const merchantStore = mongoose.connection.collection(merchantName);    
    const response = await merchantStore.find({}).toArray();
    res.status(200).json(response);    
  } catch (error) {
    console.error('Error fetching merchant data:', error);
    res.status(500).json({ error: 'Failed to fetch merchant inventory' });
  }
};