const User = require("../models/user");


async function handleUserSignUp(req,res){
  const { name, email, password} = req.body;

  await User.create({name, email, password});

  return res.redirect('/');
}

async function handleUserSignIn(req,res){
  const { email, password } = req.body;

  try{
    const token = await  User.matchPasswordAndGenerateToken(email, password);
    res.cookie('token', token);
    return res.redirect('/');

  } catch(err){
    return res.render('signin', {
      err: `${err}`
    })
  }
}

async function handleUserSignOut(req,res){
  return res.clearCookie("token").redirect('/');
}

module.exports = {
  handleUserSignUp,
  handleUserSignIn,
  handleUserSignOut
}