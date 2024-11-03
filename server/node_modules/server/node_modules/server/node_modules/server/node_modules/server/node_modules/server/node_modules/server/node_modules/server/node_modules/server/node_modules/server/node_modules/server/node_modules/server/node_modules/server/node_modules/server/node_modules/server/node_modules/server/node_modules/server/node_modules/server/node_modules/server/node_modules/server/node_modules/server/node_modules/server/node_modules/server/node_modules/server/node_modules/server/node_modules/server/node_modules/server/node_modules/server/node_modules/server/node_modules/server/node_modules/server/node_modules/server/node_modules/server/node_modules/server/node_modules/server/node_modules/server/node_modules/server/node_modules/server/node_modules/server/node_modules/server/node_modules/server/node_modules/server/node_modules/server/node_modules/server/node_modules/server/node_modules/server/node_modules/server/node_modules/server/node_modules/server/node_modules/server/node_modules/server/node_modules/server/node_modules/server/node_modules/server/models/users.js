const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    ownedLists: [{ type: Schema.Types.ObjectId, ref: 'ShoppingList' }],
    memberOfLists: [{ type: Schema.Types.ObjectId, ref: 'ShoppingList' }],
});

module.exports = mongoose.model('User', userSchema);
