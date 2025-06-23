const express = require('express');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl,
  transporter,
} = require('../utils.js');
const dns = require('dns');

const userRouter = express.Router();

const PAGE_SIZE = 12;

userRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const users = await User.find({}, 'name email phone carrier isAdmin notes')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countUsers = await User.countDocuments();
    res.send({
      users,
      totalUsers: countUsers,
      page,
      pages: Math.ceil(countUsers / PAGE_SIZE),
    });
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    user ? res.send(user) : res.status(404).send({ message: 'User Not Found' });
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.carrier = req.body.carrier || user.carrier;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post('/add', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const user = new User({
      name,
      email,
      phone,
      password: bcrypt.hashSync('defaultpassword', 8),
      isAdmin: false,
    });

    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.put(
  '/:id/notes',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.notes = req.body.notes || '';
      await user.save();
      res.send({ message: 'Notes updated successfully', notes: user.notes });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

// Save address in DB
userRouter.put(
  '/address',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.shippingAddress = req.body;
      const updatedUser = await user.save();
      res.send({
        message: 'Address saved',
        shippingAddress: updatedUser.shippingAddress,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress, // ✅ Add this
        token: generateToken(user),
      });
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: 'Password does not meet complexity requirements.',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  '/usersByIds',
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $in: req.body.userIds } });
    res.send(users);
  })
);

userRouter.post(
  '/send-email',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { emailRecipient, subject, message } = req.body;
    const emailContent = {
      from: 'lindalloyd.com',
      to: emailRecipient,
      subject: subject || 'No Subject Provided',
      html: `<p>${message || 'No message provided'}</p>`,
    };

    try {
      await transporter.sendMail(emailContent);
      res.send({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ message: 'Failed to send email' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password)
        user.password = bcrypt.hashSync(req.body.password, 8);

      // ✅ Add this block:
      if (req.body.shippingAddress) {
        user.shippingAddress = {
          ...user.shippingAddress,
          ...req.body.shippingAddress,
        };
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        phone: updatedUser.phone,
        carrier: updatedUser.carrier,
        notes: updatedUser.notes,
        shippingAddress: updatedUser.shippingAddress, // ✅ make sure this is returned
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });
      user.resetToken = token;
      await user.save();

      const emailContent = {
        from: 'lindalloyd.com',
        to: `${user.name} <${user.email}>`,
        subject: 'Reset Password',
        html: `
          <p>Please click the link to reset your password (expires in 10 minutes)</p>
          <a href="${baseUrl()}/reset-password/${token}">Reset Password</a>
        `,
      };

      try {
        await transporter.sendMail(emailContent);
      } catch (error) {
        console.error('Error sending password reset email:', error);
      }

      res.send({ message: 'We sent a reset password link to your email.' });
    } else {
      res.status(404).send({ message: 'Email Not Found' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body;

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: 'Password does not meet complexity requirements.',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: token });
        if (user) {
          user.password = bcrypt.hashSync(password, 8);
          await user.save();
          res.send({ message: 'Password reset successfully' });
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

module.exports = userRouter;
