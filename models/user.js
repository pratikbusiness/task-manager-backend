const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
        _id: Schema.Types.ObjectId,
        email:{
            type: String,
            unique:true,
            required: true
        },
        phone: {
            type: String,
            unique:true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum : ['free-user','admin'],
            default: 'free-user',
        },
        status: {
            type: String,
            enum : ['verified','blocked'],
            default: 'verified',
        }
    },{
    timestamps:{createdAt:true, updatedAt:false},
    collection: 'user'
})

module.exports = mongoose.model('user', userSchema);