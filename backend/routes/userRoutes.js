import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl,
  transporter,
} from '../utils.js';
import dns from 'dns';

const userRouter = express.Router();

export const PAGE_SIZE = 12; // 12 items per page

userRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const users = await User.find({}, 'name email phone isAdmin notes') // Include 'notes'
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
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user without a password (default password can be changed later)
    const user = new User({
      name,
      email,
      phone,
      password: bcrypt.hashSync('defaultpassword', 8), // Temporary password
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
      user.notes = req.body.notes || ''; // Update notes
      await user.save();
      res.send({ message: 'Notes updated successfully', notes: user.notes });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Password complexity requirements (example: minimum length, uppercase, lowercase, digit, and special character)
    // At least one digit ((?=.*\d))
    // At least one lowercase letter ((?=.*[a-z]))
    // At least one uppercase letter ((?=.*[A-Z]))
    // At least one special character ((?=.*[^a-zA-Z\d]))
    // A minimum length of 8 characters (.{8,})
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    // Create the user if the email domain is valid
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

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
    const userIds = req.body.userIds;
    const users = await User.find({ _id: { $in: userIds } });
    res.send(users);
  })
);

userRouter.post(
  '/send-email',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { emailRecipient, subject, message } = req.body;

    // Log the values for debugging
    // console.log('Subject:', subject);
    // console.log('Message:', message);

    const emailContent = {
      from: 'lindalloyd.com',
      to: `${emailRecipient}`,
      subject: subject || 'No Subject Provided', // Fallback for missing subject
      html: `<p>${message || 'No message provided'}</p>`, // Fallback for missing message
    };

    try {
      const info = await transporter.sendMail(emailContent);
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
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

// reset password
userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m', // Change the expiration time to 10 minutes
      });
      user.resetToken = token;
      await user.save();

      console.log(`${baseUrl()}/reset-password/${token}`);

      const emailContent = {
        from: 'lindalloyd.com',
        to: `${user.name} <${user.email}>`,
        subject: `Reset Password`,
        html: ` 
        <p>Please Click the following link to reset your password, link expires in 10 minutes</p> 
        <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
        `,
      };

      try {
        // Send the email using the `transporter`
        const info = await transporter.sendMail(emailContent);
      } catch (error) {
        console.error('Error sending email:', error);
      }
      res.send({ message: 'We sent reset password link to your email.' });
    } else {
      res.status(404).send({ message: 'Email Not Found' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body;

    // Password complexity requirements (example: minimum length, uppercase, lowercase, digit, and special character)
    // At least one digit ((?=.*\d))
    // At least one lowercase letter ((?=.*[a-z]))
    // At least one uppercase letter ((?=.*[A-Z]))
    // At least one special character ((?=.*[^a-zA-Z\d]))
    // A minimum length of 8 characters (.{8,})
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: token });
        if (user) {
          user.password = bcrypt.hashSync(password, 8);
          await user.save();
          res.send({
            message: 'Password reset successfully',
          });
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

export default userRouter;
