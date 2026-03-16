const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  specialization: { type: String, required: true },
  bio:            { type: String },
  photo:          { type: String, required: true },
  experience:     { type: Number, required: true },
  certifications: [String],
  socialLinks: {
    instagram: String,
    youtube:   String,
    linkedin:  String,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
