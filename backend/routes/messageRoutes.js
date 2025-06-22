import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import { isAuth, isAdmin, transporter } from '../utils.js';

const messageRouter = express.Router();

const PAGE_SIZE = 12; // Define the number of items per page

messageRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const messages = await Message.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countMessages = await Message.countDocuments(); // Count total number of messages
    res.send({
      messages,
      totalMessages: countMessages, // Include totalMessages in the response
      page,
      pages: Math.ceil(countMessages / pageSize), // Calculate total pages based on pageSize
    });
  })
);

messageRouter.post('/contact', async (req, res) => {
  try {
    const {
      update_time,
      fullName,
      email,
      subject,
      message,
      replied,
      replyContent,
      replyEmail,
      replySentAt,
    } = req.body;

    const newMessage = new Message({
      update_time,
      fullName,
      email,
      subject,
      message,
      replied,
      replyContent,
      replyEmail,
      replySentAt,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to save message', error: error.message });
  }
});

messageRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const foundMessages = await Message.find();
      res.json(foundMessages);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to retrieve messages', error: error.message });
    }
  })
);

messageRouter.delete(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { update_time, fullName, email, subject, message } = req.body;

      const deletedMessage = await Message.findOneAndDelete({
        update_time,
        fullName,
        email,
        subject,
        message,
      });

      if (deletedMessage) {
        res.json({ message: 'Message deleted successfully' });
      } else {
        res.status(404).json({ message: 'Message not found' });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to delete message', error: error.message });
    }
  })
);

messageRouter.post(
  '/reply',
  expressAsyncHandler(async (req, res) => {
    try {
      const { email, subject, message, replyContent } = req.body;

      const emailContent = {
        from: 'lindalloydantiques@gmail.com', // Change this to your email address
        to: email,
        subject: `Re: ${subject}`, // Append 'Re: ' to the original subject
        html: `
          <h1>Reply to Your Message</h1>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message Reply:</strong> ${message}</p>
          <p>Thank you,</p>
          <p>lindalloyd.com</p>
        `,
      };

      console.log('Reply Content:', replyContent);

      // Send the email using the transporter
      const info = await transporter.sendMail(emailContent);
      console.log('Email sent:', info);

      res.json({ message: 'Reply sent successfully' });
    } catch (error) {
      console.error('Error sending reply:', error);
      res
        .status(500)
        .json({ message: 'Failed to send reply', error: error.message });
    }
  })
);

export default messageRouter;
