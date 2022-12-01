import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/Error.js';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
  });
  newUser
    .save()
    .then((result) => {
      const { password, isAdmin, ...others } = result._doc;
      res.status(200).send(others);
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while Register',
      });
    });
};

export const login = async (req, res, next) => {
  try {
    // Get data user when login, the purpose is get the user password
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(401, 'Unauthorized'));

    // Comparation password User when Login
    const isPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isPassword) return next(createError(400, 'Wrong password or Username'));

    // Sign Cookie for all route, the function is for make ez when we need data user Login, i think the concept like SESSION when we use PHP
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT);
    // Destructuring data untuk memisahkan beberapa bagian object data yang tidak ingin dikirim atau sebaliknya
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie('access_token', token, {
        // membuat cookie dengan nama access_token
        httpOnly: true,
      })
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    res.status(409).json({
      message: err.message || 'Some Error while Register',
    });
  }
};
