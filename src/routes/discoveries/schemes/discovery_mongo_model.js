const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, {convert: false});

const joiDiscoverySchema = require('./discovery');

const mongooseDiscoverySchema = new Mongoose.Schema(Joigoose.convert(joiDiscoverySchema), {versionKey: false});

module.exports = Mongoose.model('Discovery', mongooseDiscoverySchema);
