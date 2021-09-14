var express = require('express');
var app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//App level settings 
dotenv.config();
app.use(cors({
    origin : '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var port = process.env.PORT || 80;

//Database Connection
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log('Database Connection Successful'))
    .catch(error=>console.log('Error DB Connect '+error))

//Unauthenticated routes
app.get('/', (req, res) => { res.send('Hello World, Welcome to Home page.'); })
app.use('/api/user', require('./routes/auth'))

//Protected Routes
app.use('/api/data',require('./routes/data'))

app.listen(port,()=> console.log( '\n'+`===============>  Listenning on ${port}`));