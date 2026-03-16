const Program   = require('../models/Program');
const Trainer   = require('../models/Trainer');
const { Blog, Contact, Testimonial, Gallery, Membership } = require('../models/index');
const User      = require('../models/User');
const jwt       = require('jsonwebtoken');
const {
  sendEmail,
  contactNotificationEmail,
  contactConfirmationEmail,
  membershipWelcomeEmail,
} = require('../utils/emailService');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// ─── AUTH ─────────────────────────────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ─── PROGRAMS ────────────────────────────────────────────────────────────────
exports.getPrograms = async (req, res) => {
  try {
    const { category, level } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    const programs = await Program.find(filter).populate('trainer', 'name photo specialization').sort('-createdAt');
    res.json({ success: true, count: programs.length, data: programs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── TRAINERS ────────────────────────────────────────────────────────────────
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({ isActive: true });
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, data: trainer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, data: trainer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Trainer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── BLOGS ───────────────────────────────────────────────────────────────────
exports.getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    const blogs = await Blog.find(filter).sort('-createdAt');
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CONTACTS ────────────────────────────────────────────────────────────────
exports.submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Gym ला notification email
    await sendEmail(contactNotificationEmail(req.body));

    // User ला confirmation email
    if (req.body.email) {
      await sendEmail(contactConfirmationEmail(req.body));
    }

    res.status(201).json({ success: true, message: "Message received! We'll contact you within 24 hours.", data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort('-createdAt');
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── GALLERY ────────────────────────────────────────────────────────────────
exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    const items = await Gallery.find(filter).sort('-createdAt');
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── MEMBERSHIPS ─────────────────────────────────────────────────────────────
exports.getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().sort('-createdAt');
    res.json({ success: true, count: memberships.length, data: memberships });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.enrollMembership = async (req, res) => {
  try {
    const membership = await Membership.create(req.body);

    // Member ला welcome email
    if (req.body.email) {
      await sendEmail(membershipWelcomeEmail(req.body));
    }

    res.status(201).json({ success: true, message: 'Enrollment successful! Welcome to Titan Fitness Club!', data: membership });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalMembers, activePrograms, totalContacts, unreadContacts, totalBlogs] = await Promise.all([
      Membership.countDocuments({ status: 'active' }),
      Program.countDocuments({ isActive: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Blog.countDocuments({ isPublished: true }),
    ]);
    res.json({ success: true, data: { totalMembers, activePrograms, totalContacts, unreadContacts, totalBlogs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
