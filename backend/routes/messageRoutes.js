import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import { isAuth, isAdmin } from '../utils.js';

const messageRouter = express.Router();

const PAGE_SIZE = 12;

// Admin: Paginated message list
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
    const countMessages = await Message.countDocuments();

    res.send({
      messages,
      totalMessages: countMessages,
      page,
      pages: Math.ceil(countMessages / pageSize),
    });
  })
);

// User: Submit contact form
messageRouter.post(
  '/contact',
  expressAsyncHandler(async (req, res) => {
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

      await sendAdminSMS({
        subject: '📩 New Message Received',
        message: `"${subject}"\nFrom: ${fullName} (${email})`,
        customerName: fullName,
      });

      const savedMessage = await newMessage.save();
      res.status(201).json(savedMessage);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to save message', error: error.message });
    }
  })
);

// Admin: Fetch all messages
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

// Admin: Delete message
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

// Admin: Send reply email
messageRouter.post(
  '/reply',
  expressAsyncHandler(async (req, res) => {
    try {
      const { email, subject, message, replyContent } = req.body;

      const emailContent = {
        from: 'lindalloydantiques@gmail.com',
        to: email,
        subject: `Re: ${subject}`,
        html: `
          <h1>Reply to Your Message</h1>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message Reply:</strong> ${replyContent}</p>
          <p>Thank you,</p>
          <p>lindalloyd.com</p>
        `,
      };

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
