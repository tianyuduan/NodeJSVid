const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

//index route
app.get('/', (req, res ) => {
  res.render('index');
});
//handling a get request here

//ABOUT route
app.get('/about', (req, res)=> {
  res.render('About');
});

//load routes;
const ideas = require('./routes/ideas');
const users = require('./routes/users');


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


//user login route
app.get('/users/login', (req, res) => {
});
//user register route
app.get('/users/register', (req, res) => {
});
//how middleware works
app.use(function(req, res, next){
  console.log(Date.now());
  next();
});

//use routes
app.use('/ideas', ideas);
app.use('/users', users);
