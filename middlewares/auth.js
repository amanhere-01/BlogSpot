const { validateUserToken } = require("../services/authentication");

function checkForAuthentication(req,res,next){
  const token = req.cookies?.token;                                                 
  if(!token) return next();

  try{
    const userPayload = validateUserToken(token);
    req.user = userPayload;
  } catch(err) {}

  next();
}

module.exports = {
  checkForAuthentication,
}