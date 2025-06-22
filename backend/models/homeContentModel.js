import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  h4Text: { type: [String], required: false },
  jumbotronImages: { type: [String], required: false }, // Array for multiple images
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;
