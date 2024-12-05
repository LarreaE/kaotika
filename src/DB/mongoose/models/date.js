import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Main Equipment and Potions Schema
const dateSchema = new Schema({
    date: { type: Date },
  });

export const DateModel = mongoose.models.DateModel || mongoose.model('DateModel', dateSchema, 'date');

