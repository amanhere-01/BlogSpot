require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user');
const { checkForAuthentication } = require('./middlewares/auth');



const app = express();
const PORT = 8000;

mongoose.connect(process.env.MONGODB_URL)
  .then(console.log('Database connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthentication);


app.get('/', (req,res) => {
  res.render('homepage', {
    user: req.user,
  });
})

app.use('/user', userRouter);

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
