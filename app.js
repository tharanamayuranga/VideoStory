const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash =require('connect-flash');
const session=require('express-session');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');


const app = express();

//Load routes
const ideas=require('./routes/ideas');
const users=require('./routes/users');


// Map global promise - get rid of warning
//mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/videostory-dev',{
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser Middleware
app.use(bodyParser.urlencoded({extended:false}));

//parse application/json
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

//Global variables
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});





//Use routes
app.use('/ideas',ideas);
app.use('/users',users);


const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});