import mongoose from '@/DB/mongoose/config';

export const getRandomItems = async (collectionName: string, count: number) => {
  const items = await mongoose.connection.collection(collectionName).find({}).toArray();
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
