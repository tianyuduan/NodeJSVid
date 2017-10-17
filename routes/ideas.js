const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
//load Idea model
require('../models/idea');
const Idea = mongoose.model('ideas');

//add idea form
router.get('/add', (req, res)=> {
  res.render('ideas/add');
});

//EDIT IDEA form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

//edit form process
router.put('/:id', (req, res) => {
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
router.get('/', (req, res)=>{
  Idea.find({})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index',{
      ideas:ideas
    });
  });
});


//idea delete
router.delete('/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(()=>{
    req.flash('success_msg', "Video idea removed");
    res.redirect('/ideas');
  });
});

//post request idea process form
router.post('/', (req, res)=> {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }

  if(!req.body.details){
    errors.push({text: 'Please submit details as well'});
  }
  if (errors.length > 0) {
    res.render('/add', {
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
  // console.log(req.body);
  // res.send('ok');
});



module.exports = router;
