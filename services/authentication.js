const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

function createUserToken(user){
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role
  };

  const token = jwt.sign(payload, SECRET_KEY);

  return token;
}

function validateUserToken(token){
  const payload = jwt.verify(token, SECRET_KEY);
  return payload;
}

module.exports = {
  createUserToken,
  validateUserToken
}