const mongoose = require('mongoose');

const faqContentSchema = new mongoose.Schema({
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

const FaqContent = mongoose.model('FaqContent', faqContentSchema);

module.exports = FaqContent;
