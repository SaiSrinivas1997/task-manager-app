const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
  dueDate: {
    type: Date,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
