const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  jumbotronText: { type: [String], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  h4Text: { type: [String], required: true },
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

module.exports = HomeContent;
