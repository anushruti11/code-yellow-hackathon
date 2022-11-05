const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./models/user');
const cors = require('cors');
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send('Please enter all fields');
    return;
  }
  try {
    const userVal = await user.findOne({ email });
    if (!userVal) {
      const newUser = new user({
        name,
        email,
        password,
      });
      await newUser.save();
      res.send('User created');
    } else {
      res.status(400).send('User already exists');
    }
  } catch (error) {
    res.status(400).send("Can't create user");
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Please enter all fields');
    return;
  }
  try {
    const userVal = await user.findOne({ email, password });
    if (!userVal) {
      res.status(400).send('Invalid email or password');
      return;
    }
    res.send(userVal);
  } catch (error) {
    res.send(error);
  }
});

const MONGODB_URI =
  'mongodb+srv://anushrutidb:coursera@cluster0.xqhki.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected!'))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
