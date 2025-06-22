import mongoose from 'mongoose';

const aboutContentSchema = new mongoose.Schema({
  jumbotronImage: {
    url: { type: String, required: false }, // Change `required: true` to `false`
    name: { type: String },
  },
  sections: [
    {
      title: { type: String, required: true },
      paragraphs: [{ type: String, required: true }],
      images: [
        {
          url: { type: String, required: true },
          name: { type: String },
        },
      ],
    },
  ],
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);
export default AboutContent;
