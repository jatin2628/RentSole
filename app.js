const express = require('express');
const bodyParser = require('body-parser');
const port = process.PORT || 3000;
// const sequelize = require('./database/db');
require('dotenv').config();
const path = require('path');

// const verifyUser = require("./middleware/verify");


// console.log(`my vwerif user contaoin ${verifyUser}`);


// Property.sync();


const registerRoute = require('./routes/user');
const propertyRoute = require('./routes/property');
const staticPath = path.join(__dirname,"../","public");


const app = express();

app.set('view engine', 'ejs')

// app.use(bodyParser.urlencoded({extended:false}));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(staticPath));



app.use(registerRoute);
app.use(propertyRoute);


app.use('/', (req,res)=>{
    res.status(200).send('welcome to our home page')
})



app.listen(port,()=>{
    console.log(`app is listen at ${port}`);
})