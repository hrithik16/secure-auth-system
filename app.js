require('dotenv').config(); //For Env variables
const express = require('express')
const db = require('./config/connect');
const port = 8000;
const path = require('path')


const app = express()

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded())
app.use(express.static('assets'))
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log('Error in running server: ',err);
    }
    console.log(`Server is running on port localhost:${port}`);
})