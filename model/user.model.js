const db = require('./dbConnection.model');

const Schema = db.Schema;
const Model = db.model;

const usersTableSchema = new Schema({
    googleID: {type: String},
    name: {type: String},
    email: {type: String, unique: true, dropDups: true},
    password: {type: String},
    role: {type: String, default: 'User'},
    coins: {type: Number, default: 1000},
    rent: {type: Number, default: 0},
    rents: [{type: Schema.Types.ObjectId, ref:'rents'}]
});

exports.users = Model('users', usersTableSchema);
