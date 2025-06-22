const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  sections: [
    {
      title: { type: String, required: true },
      paragraphs: [{ type: String, required: true }],
    },
  ],
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

module.exports = AboutContent;
