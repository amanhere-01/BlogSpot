const { Router } = require('express');
const { handleUserSignUp, handleUserSignIn, handleUserSignOut } = require('../controllers/user');

const router = Router();

router.get('/signup', (req,res) => {
  return res.render('signup');
})

router.get('/signin', (req,res) => {
  return res.render('signin');
})

router.post('/signup', handleUserSignUp);

router.post('/signin', handleUserSignIn)

router.get('/signout', handleUserSignOut)

module.exports = router;