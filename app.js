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

//idea index pages
app.get('./ideas', (req, res)=>{
  Idea.find({})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
  res.render('ideas/index');
});

//post request idea process form
app.post('/ideas', (req, res)=> {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }

  if(!req.body.details){
    errors.push({text: 'Please submit details as well'});
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
    errors: errors,
    title: req.body.title,
    details: req.body.details,
  });
} else {
  const newUser = {
    title: req.body.title,
    details: req.body.details,
  };
  new Idea(newUser).save()
  .then(idea => {
    res.redirect('/ideas');
  });
}

});


//how middleware works
app.use(function(req, res, next){
  console.log(Date.now());
  next();
});
