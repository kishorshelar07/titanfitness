const mongoose = require('mongoose');

// ─── Blog ─────────────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  slug:     { type: String, unique: true },
  excerpt:  { type: String, required: true },
  content:  { type: String, required: true },
  category: { type: String, enum: ['Workout','Nutrition','Mindset','Lifestyle'], default: 'Workout' },
  image:    { type: String, required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:     [String],
  views:    { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  next();
});

// ─── Contact ──────────────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  interest:    { type: String },
  message:     { type: String, required: true },
  isRead:      { type: Boolean, default: false },
  isReplied:   { type: Boolean, default: false },
}, { timestamps: true });

// ─── Testimonial ──────────────────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  role:      { type: String },
  photo:     { type: String },
  content:   { type: String, required: true },
  rating:    { type: Number, min: 1, max: 5, default: 5 },
  result:    { type: String },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

// ─── Gallery ──────────────────────────────────────────────────────────────────
const gallerySchema = new mongoose.Schema({
  title:    { type: String },
  image:    { type: String, required: true },
  category: { type: String, enum: ['Gym Floor','Training','Transformations','Events'], default: 'Gym Floor' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Membership ───────────────────────────────────────────────────────────────
const membershipSchema = new mongoose.Schema({
  memberName:    { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  plan:          { type: String, enum: ['Basic','Pro','Elite'], required: true },
  billingCycle:  { type: String, enum: ['monthly','yearly'], default: 'monthly' },
  startDate:     { type: Date, default: Date.now },
  endDate:       { type: Date },
  amount:        { type: Number, required: true },
  status:        { type: String, enum: ['active','expired','cancelled'], default: 'active' },
}, { timestamps: true });

module.exports = {
  Blog:        mongoose.model('Blog', blogSchema),
  Contact:     mongoose.model('Contact', contactSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Gallery:     mongoose.model('Gallery', gallerySchema),
  Membership:  mongoose.model('Membership', membershipSchema),
};
