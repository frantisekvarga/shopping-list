const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoListSchema = new Schema({
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tasks: [ 
      {
        task: { type: Schema.Types.ObjectId, ref: 'Item' },
        completed: { type: Boolean, default: false }
      }
    ],
    completed: { type: Boolean, default: false }
});
  
module.exports = mongoose.model('TodoList', todoListSchema);
