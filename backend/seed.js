const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User       = require('./models/User');
const Program    = require('./models/Program');
const Trainer    = require('./models/Trainer');
const { Blog, Testimonial, Gallery } = require('./models/index');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      Program.deleteMany({}),
      Trainer.deleteMany({}),
      Blog.deleteMany({}),
      Testimonial.deleteMany({}),
      Gallery.deleteMany({}),
    ]);
    console.log('Old data cleared');

    // Admin User
    await User.create({
      name:     'Admin',
      email:    'admin@titanfitness.com',
      password: 'TitanPune@#2026',
      role:     'admin',
    });
    console.log('Admin user created');

    // Trainers
    const trainers = await Trainer.insertMany([
      {
        name:           'Arjun Rao',
        specialization: 'Strength & Conditioning',
        bio:            'National-level powerlifter turned coach with 9+ years of experience.',
        photo:          'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&q=80',
        experience:     9,
        certifications: ['NSCA-CSCS', 'IPF Coach Level 2', 'Precision Nutrition L1'],
        socialLinks:    { instagram: '#', youtube: '#', linkedin: '#' },
      },
      {
        name:           'Priya Sharma',
        specialization: 'Fat Loss & Nutrition',
        bio:            'Evidence-based nutrition science with smart training.',
        photo:          'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&q=80',
        experience:     7,
        certifications: ['ACE Certified PT', 'Precision Nutrition L2'],
        socialLinks:    { instagram: '#', youtube: '#', linkedin: '#' },
      },
      {
        name:           'Rohan Desai',
        specialization: 'CrossFit & HIIT',
        bio:            'CrossFit Level-2 Trainer and functional fitness specialist.',
        photo:          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&q=80',
        experience:     6,
        certifications: ['CrossFit L-2 Trainer', 'NASM-CPT'],
        socialLinks:    { instagram: '#', youtube: '#', linkedin: '#' },
      },
      {
        name:           'Kavya Nair',
        specialization: 'Yoga & Wellness',
        bio:            'RYT-500 certified yoga instructor and mindfulness coach.',
        photo:          'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=500&q=80',
        experience:     8,
        certifications: ['RYT-500 Yoga Alliance', 'Mindfulness Meditation Teacher'],
        socialLinks:    { instagram: '#', youtube: '#', linkedin: '#' },
      },
    ]);
    console.log('Trainers created: ' + trainers.length);

    // Programs — slug manually dila ahe (insertMany madhe pre-save hook chalat nahi)
    await Program.insertMany([
      {
        title:       'Weight Training',
        slug:        'weight-training',
        category:    'Weight Training',
        image:       'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80',
        duration:    '3-6 Months',
        price:       2499,
        level:       'Beginner',
        description: 'Build raw power and sculpt your physique with our structured weight training programs designed by elite coaches.',
        features:    ['Personalized workout plan', 'Nutrition guidance', 'Weekly progress tracking', 'Access to all equipment'],
        trainer:     trainers[0]._id,
      },
      {
        title:       'CrossFit',
        slug:        'crossfit',
        category:    'CrossFit',
        image:       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80',
        duration:    'Ongoing',
        price:       3199,
        level:       'Intermediate',
        description: 'High-intensity functional training that builds explosive strength, endurance, and athletic performance.',
        features:    ['Daily WOD', 'Community classes', 'Olympic lifting coaching', 'Body composition tracking'],
        trainer:     trainers[2]._id,
      },
      {
        title:       'Fat Loss',
        slug:        'fat-loss',
        category:    'Fat Loss',
        image:       'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=700&q=80',
        duration:    '8 Weeks',
        price:       2799,
        level:       'Beginner',
        description: 'Science-backed fat loss protocols combining cardio, diet, and strength training for maximum results.',
        features:    ['Custom calorie deficit plan', 'HIIT sessions', 'Weekly weigh-ins', 'Meal prep guidance'],
        trainer:     trainers[1]._id,
      },
      {
        title:       'Strength Training',
        slug:        'strength-training',
        category:    'Strength Training',
        image:       'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80',
        duration:    '12 Weeks',
        price:       2999,
        level:       'Intermediate',
        description: 'Progressive overload principles for maximum strength gain.',
        features:    ['Powerlifting techniques', 'Periodization programming', 'One-rep max testing', 'Mobility & recovery'],
        trainer:     trainers[0]._id,
      },
      {
        title:       'Personal Training',
        slug:        'personal-training',
        category:    'Personal Training',
        image:       'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=80',
        duration:    'Flexible',
        price:       5999,
        level:       'Beginner',
        description: 'One-on-one coaching with elite certified trainers. Fully customized to your goals.',
        features:    ['100% customized programming', 'Diet + lifestyle coaching', 'Biweekly body analysis', 'WhatsApp support'],
        trainer:     trainers[0]._id,
      },
      {
        title:       'Bodybuilding',
        slug:        'bodybuilding',
        category:    'Bodybuilding',
        image:       'https://images.unsplash.com/photo-1627483298606-cf54c61779a9?w=700&q=80',
        duration:    '16 Weeks',
        price:       4499,
        level:       'Advanced',
        description: 'Compete-ready physique development with stage coaching.',
        features:    ['Competition prep coaching', 'Posing practice', 'Peak week protocols', 'Supplement guidance'],
        trainer:     trainers[0]._id,
      },
    ]);
    console.log('Programs created');

    // Testimonials
    await Testimonial.insertMany([
      {
        name:    'Rahul Mehta',
        role:    'Software Engineer',
        photo:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        content: 'Titan completely changed my life. I lost 22kg in 5 months under Priya guidance. Best gym in Pune!',
        rating:  5,
        result:  '-22 kg in 5 months',
      },
      {
        name:    'Vikram Singh',
        role:    'CA Professional',
        photo:   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
        content: 'Arjun strength training took my deadlift from 80kg to 160kg in 6 months. Elite-level programming.',
        rating:  5,
        result:  '80kg to 160kg deadlift',
      },
      {
        name:    'Sneha Kulkarni',
        role:    'Entrepreneur',
        photo:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
        content: 'Kavya yoga program fit perfectly into my schedule. Stronger, flexible and mentally sharper!',
        rating:  5,
        result:  'Complete lifestyle transformation',
      },
      {
        name:    'Aditya Joshi',
        role:    'Product Manager',
        photo:   'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&q=80',
        content: 'Rohan CrossFit classes are next level. Best coaching quality across Mumbai, Bangalore, and Dubai.',
        rating:  5,
        result:  'CrossFit Regional qualifier',
      },
      {
        name:    'Neha Patil',
        role:    'Business Owner',
        photo:   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        content: 'The Elite membership is genuinely elite. Personal training, spa access, nutrition coaching everything.',
        rating:  5,
        result:  'Complete health transformation at 42',
      },
    ]);
    console.log('Testimonials created');

    // Gallery
    await Gallery.insertMany([
      { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80', category: 'Gym Floor',       title: 'Main Training Floor'       },
      { image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=700&q=80', category: 'Training',         title: 'Cardio Zone'               },
      { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80', category: 'Gym Floor',       title: 'Free Weights Section'      },
      { image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=700&q=80', category: 'Transformations', title: 'Member Transformation'     },
      { image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=80', category: 'Training',         title: 'Personal Training Session' },
      { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80', category: 'Training',         title: 'CrossFit Class'            },
      { image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80', category: 'Gym Floor',       title: 'Strength Zone'             },
      { image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=700&q=80', category: 'Transformations', title: 'Real Results'              },
    ]);
    console.log('Gallery created');

    // Blogs
    const admin = await User.findOne({ role: 'admin' });
    await Blog.insertMany([
      {
        title:    'The 5x5 Strength Protocol Why Simple Works Best',
        slug:     'the-5x5-strength-protocol',
        excerpt:  'Discover why the proven 5x5 training method produces the most consistent strength gains.',
        content:  'The 5x5 method is one of the oldest and most proven strength training protocols. By performing 5 sets of 5 reps on the big compound lifts you create the perfect stimulus for both strength and muscle growth.',
        category: 'Workout',
        image:    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80',
        author:   admin._id,
        tags:     ['strength', 'programming'],
      },
      {
        title:    'High Protein Indian Diet for Muscle Building',
        slug:     'high-protein-indian-diet',
        excerpt:  'A complete guide to building muscle on an Indian diet dal paneer chicken and more.',
        content:  'Building muscle on an Indian diet is absolutely possible. Key protein sources include Paneer 100g 18g protein, Dal 1 cup 18g protein, Chicken breast 100g 31g protein, Eggs 1 egg 6g protein.',
        category: 'Nutrition',
        image:    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=80',
        author:   admin._id,
        tags:     ['nutrition', 'diet', 'protein'],
      },
      {
        title:    'How Discipline Beats Motivation Every Single Time',
        slug:     'discipline-beats-motivation',
        excerpt:  'Motivation comes and goes. Discipline shows up at 6AM. Here is how to build it.',
        content:  'Motivation is an emotion it fluctuates. Discipline is a skill it can be trained. The most successful athletes simply show up regardless of how they feel.',
        category: 'Mindset',
        image:    'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=700&q=80',
        author:   admin._id,
        tags:     ['mindset', 'discipline'],
      },
      {
        title:    'CrossFit vs Traditional Gym Which Is Right For You',
        slug:     'crossfit-vs-traditional-gym',
        excerpt:  'Both approaches have merits. We break down the science to help you choose.',
        content:  'CrossFit offers constantly varied functional movements at high intensity. Traditional gym training offers more control over progressive overload and isolation exercises.',
        category: 'Workout',
        image:    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80',
        author:   admin._id,
        tags:     ['crossfit', 'gym'],
      },
      {
        title:    'Sleep The Most Underrated Performance Drug',
        slug:     'sleep-performance-recovery',
        excerpt:  'No amount of training can compensate for poor sleep. Here is the science.',
        content:  'During sleep your body releases growth hormone repairs muscle tissue and restores mental clarity. Aim for 7-9 hours of quality sleep every night.',
        category: 'Lifestyle',
        image:    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80',
        author:   admin._id,
        tags:     ['sleep', 'recovery'],
      },
      {
        title:    'Yoga for Athletes Flexibility Is Strength',
        slug:     'yoga-for-athletes',
        excerpt:  'Elite athletes worldwide are adding yoga to their training. Here is why.',
        content:  'Yoga improves range of motion reduces injury risk and speeds up recovery. Even 2-3 sessions of 20-30 minutes per week can make a significant difference.',
        category: 'Workout',
        image:    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=80',
        author:   admin._id,
        tags:     ['yoga', 'flexibility'],
      },
    ]);
    console.log('Blogs created');

    console.log('');
    console.log('SEED COMPLETE!');
    console.log('Email    : admin@titanfitness.com');
    console.log('Password : admin123');
    process.exit(0);

  } catch (err) {
    console.error('Seed error: ' + err.message);
    process.exit(1);
  }
};

run();
