var mongoose = require('mongoose');

// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called gillers.
 */
var TASchema = new Schema(
  {
    stunum: {
      type: Number,
      required: true,
      unique: true
    },
    givenname: {
      type: String,
      requried: true
    },
    familyname: {
      type: String, required: true
    },
    phone: {
      type: Number,
      required: true
    },
    birthday: {
      type: String
    }
  },
  {
    collection: 'ta'
  }
);

// Doc for Mongoose Connections: http://mongoosejs.com/docs/connections
mongoose.connect('mongodb://localhost/tas');

// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = mongoose.model('ta', TASchema);