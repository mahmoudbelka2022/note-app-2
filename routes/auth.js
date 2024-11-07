const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (password !== password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
      return res.render('register', { errors, name, email });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('register', { errors, name, email });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { errors: [{ msg: 'Registration error' }] });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;

// routes/notes.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Note = require('../models/Note');

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    res.render('dashboard', { user: req.user, notes });
  } catch (err) {
    console.error(err);
    res.render('dashboard', { error: 'Error fetching notes' });
  }
});

router.post('/notes', ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({
      title,
      content,
      user: req.user.id
    });
    await newNote.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.delete('/notes/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
