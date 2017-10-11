const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();

//Conect to mongoose
mongoose.connect('mongodb://localhost/youtubeidea-dev', {
  useMongoClient: true
}).then(()=>
    console.log('DB connected!'))
    .catch(err => console.log(err));


//middleware to use bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//load Idea model
require('./models/idea');
const Idea = mongoose.model('ideas');

//Map global promises - get rid of depracation warning
mongoose.Promise = global.Promise;

//handlebars middleware
//want to use handlebars temple engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// initializes application
const port = 5000;

app.listen(port, () => {
console.log(`server started on ${port}`);
console.log('server started on' + port);
});
// listens on a certain port
//Above the same thing

//index route
app.get('/', (req, res ) => {
  res.render('index');
});
//handling a get request here


//ABOUT route
app.get('/about', (req, res)=> {
  res.render('About');
});

//add idea form
app.get('/ideas/add', (req, res)=> {
  res.render('ideas/add');
});

//post request idea
app.post('/ideas', (req, res)=> {
  console.log(req.body);
  res.send('ok');
});


//how middleware works
app.use(function(req, res, next){
  console.log(Date.now());
  next();
});
