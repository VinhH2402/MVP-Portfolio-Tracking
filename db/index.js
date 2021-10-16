const mongoose = require('mongoose');
const { useCallback } = require('react');
mongoose.connect('mongodb://localhost:27017/allexchanges', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('data connected')
})

const keysSchema = new mongoose.Schema({
  exchange: String,
  API_KEY: String,
  SECRET_KEY: String
});

const Keys = mongoose.model('Keys', keysSchema);

const add = (data, callback) => {
  const key = new Keys(data)
  key.save((err) => {
    console.log('key is saved')
    callback('saved')
    if (err) { return err }
  })
}



module.exports.Keys = Keys;
module.exports.add = add