import mongoose from '@/DB/mongoose/config';

export const getRandomItems = async (collectionName: string, count: number) => {
  const model = mongoose.models[collectionName];
  if (!model) {
    throw new Error(`Model for collection "${collectionName}" not found.`);
  }
  const items = await model.find({});
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
