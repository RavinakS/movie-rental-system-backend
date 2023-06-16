const db = require('./dbConnection.model');

const Schema = db.Schema;
const Model = db.model;

const moviesTableSchema = new Schema({
    name: {type: String, unique: true, dropDups: true},
    releasDate: {type: Date},
    genre: {type: String},
    avalCD: {type: Number},
    rents: [{type: Schema.Types.ObjectId, ref:'rents'}],
    user_id:{type:Schema.Types.ObjectId ,ref:"users"},
    coins: {type: Number, default: 10},
    image: {type: String}
});

exports.movies = Model('movies', moviesTableSchema);