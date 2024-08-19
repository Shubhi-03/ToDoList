import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
},{timestamps: true});

export const Task = mongoose.model('Task', taskSchema);