const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt');
const { createUserToken } = require('../services/authentication');


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl:{
      type: String,
      default: "public/images/default.png"
    },
    role:{
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    }
  },
  {timestamps: true}
)

userSchema.pre('save', async function (next) {  //this function block will run first before saving the user
  const user = this;

  if (!user.isModified('password')) return next();  //password IS new => isModified = true => hash it   ////password is not changed => isModified = false => skip hashing

  const saltRounds =  10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds); 

  user.password = hashedPassword;
  
  next();
});


// Method to compare password during login
userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found!");

  const passwordMatched =  await bcrypt.compare(password, user.password);

  if(!passwordMatched) throw new Error("Incorrect Password");

  const token = createUserToken(user);

  return token;
};

const User = model('user', userSchema);

module.exports = User;