const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Role = require('./models/Role');
const Contact = require('./models/Contact');
const { secret } = require('./config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
  async registration(req, res) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: 'Ur validation is wrong', validationErrors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'User exist' });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });
      await user.save();
      return res.json({ message: 'Register successful' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Incorect password' });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login error' });
    }
  }

  async addContactDB(req, res) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: 'Ur validation is wrong', validationErrors });
      }
      const { name } = req.body;
      const contact = new Contact({ name });
      await contact.save();
      return res.json({ message: 'Adding contact successful' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Adding contact error' });
    }
  }

  async delContactDB(req, res) {
    try {
      const contId = req.params.id;
      await Contact.findOneAndDelete({ _id: contId }).then((err, doc) => {
        if (err) {
          console.log(err);
          // return res.status(500).json({ message: 'Deleting failed' });
        }
      });
      return res.json({ message: `Deleting contact successful ${contId}` });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Deleting contact error' });
    }
  }

  async getContacts(req, res) {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
      // const userRole = new Role();
      // const adminRole = new Role({ value: 'ADMIN' });
      // await userRole.save();
      // await adminRole.save();
      // res.json('server work');
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Getting contacts error' });
    }
  }
}

module.exports = new authController();
