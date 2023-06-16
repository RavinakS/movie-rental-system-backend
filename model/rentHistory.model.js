const db = require('./dbConnection.model');

const Schema = db.Schema;
const Model = db.model;

const rentHistorySchema = new Schema({
    name: {type: String},
    rentDate: {type: Date},
    returnDate: {type: Date},
    releasDate: {type: Date},
    fetchedOn: {type: Date},
    genre: {type: String},
    user: {type: String},
    user_id:{type:Schema.Types.ObjectId ,ref:"users"},
});

exports.rentHistory = Model('rentHistory', rentHistorySchema);