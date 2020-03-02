const express = require('express'),
      path = require('path');

// Initiliazations
const app = express();
require('dotenv').config();
require('./database');
// Settings
app.set('port', process.env.PORT || 3001);
app.set('key', process.env.MASTER_KEY);
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes /src/Routes

app.use('/api/',require('./Routes/'));


// Starting server
app.listen(app.get('port'), function(){
    console.log('server on port ', app.get('port'));
})

