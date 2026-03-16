const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title:       { type: String, required: [true, 'Title required'], trim: true },
  slug:        { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ['Weight Training','CrossFit','Fat Loss','Strength Training','Personal Training','Bodybuilding','Yoga'], required: true },
  image:       { type: String, required: true },
  duration:    { type: String, required: true },
  price:       { type: Number, required: true },
  level:       { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Beginner' },
  features:    [String],
  trainer:     { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  isActive:    { type: Boolean, default: true },
  enrollments: { type: Number, default: 0 },
}, { timestamps: true });

programSchema.pre('save', function (next) {
  this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  next();
});

module.exports = mongoose.model('Program', programSchema);
