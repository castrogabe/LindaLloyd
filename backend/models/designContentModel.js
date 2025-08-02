import mongoose from 'mongoose';

const designContentSchema = new mongoose.Schema({
  sections: [
    {
      title: { type: String, required: true },
      paragraphs: [{ type: String, required: true }],
    },
  ],
});

const DesignContent = mongoose.model('DesignContent', designContentSchema);

export default DesignContent;
