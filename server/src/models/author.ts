import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
	name: String,
	age: Number,
});

export const authorModel = mongoose.model('Author', authorSchema);