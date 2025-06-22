import mongoose from 'mongoose';

const aboutContentSchema = new mongoose.Schema({
  sections: [
    {
      title: { type: String, required: true },
      paragraphs: [{ type: String, required: true }],
      images: [
        {
          url: { type: String, required: true }, // Image URL or path
          name: { type: String }, // Image name
        },
      ],
    },
  ],
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

export default AboutContent;
