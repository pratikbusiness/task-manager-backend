const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require('./user')

let datasetSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user_id:{type: Schema.Types.ObjectId,ref:userModel,required:true},
    todo:[
        {
            _id:Schema.Types.ObjectId,
            title:String,
            desc:String,
        }
    ],
    doing:[
        {
            _id:Schema.Types.ObjectId,
            title:String,
            desc:String,
        }
    ],
    done:[
        {
            _id:Schema.Types.ObjectId,
            title:String,
            desc:String,
        }
    ],
},{
    timestamps:{createdAt:true, updatedAt:true},
    collection: 'dataset'
})

module.exports = mongoose.model('dataset', datasetSchema);