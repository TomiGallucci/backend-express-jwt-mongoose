const mongoose = require('mongoose');

const url =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-ailjj.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then( (db) => console.log('Db connected'))
  .catch((err)=> console.error(err));