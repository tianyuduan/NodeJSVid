const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
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
//middleware methodOverride
app.use(methodOverride('_method'));
//middleware session express
app.use(session({
  secret: 'secret',
  resave: true,
  saveUnintialized: true,
}));

app.use(flash());

//global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

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

//EDIT IDEA form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

//edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash('success_msg', "Video idea updated");
      res.redirect('/ideas');
    }
  );
  });
});

//idea index page
app.get('/ideas', (req, res)=>{
  Idea.find({})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index',{
      ideas:ideas
    });
  });
});


//idea delete
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(()=>{
    req.flash('success_msg', "Video idea removed");
    res.redirect('/ideas');
  });
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
    req.flash('success_msg', "Video idea added");
    res.redirect('/ideas');
  });
}
  console.log(req.body);
  res.send('ok');
});

//how middleware works
app.use(function(req, res, next){
  console.log(Date.now());
  next();
});
