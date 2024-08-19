
import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type:String,
    required: true
  },
  task: 
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    ],
  
},{timestamps: true});

export const List = mongoose.model('List', ListSchema);