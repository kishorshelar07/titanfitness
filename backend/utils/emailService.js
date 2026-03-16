const nodemailer = require('nodemailer');

// ── Transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Email Templates ───────────────────────────────────────────────

// 1. Gym ला contact notification
const contactNotificationEmail = (data) => ({
  from: `"Titan Fitness Website" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_TO || process.env.EMAIL_USER,
  subject: `New Inquiry from ${data.firstName} ${data.lastName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f0ede8; padding: 0; border: 1px solid #333;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff4d00, #ff6b2b); padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; letter-spacing: 6px; color: white;">TITAN</h1>
        <p style="margin: 5px 0 0; font-size: 0.75rem; letter-spacing: 4px; color: rgba(255,255,255,0.8);">FITNESS CLUB · PUNE</p>
      </div>

      <!-- Body -->
      <div style="padding: 36px;">
        <h2 style="color: #ff4d00; font-size: 1.1rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px;">
          New Inquiry Received
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 0.85rem; width: 140px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #222; font-weight: bold;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 0.85rem;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #222;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 0.85rem;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #222;">${data.phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #888; font-size: 0.85rem;">Interested In</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ff4d00;">${data.interest || 'General Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 0.85rem; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; line-height: 1.6;">${data.message}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 16px; background: rgba(255,77,0,0.1); border-left: 3px solid #ff4d00;">
          <p style="margin: 0; font-size: 0.85rem; color: #ff4d00;">
            ⚡ Reply within 24 hours to maximize conversion!
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 20px 36px; background: #0a0a0a; text-align: center;">
        <p style="margin: 0; font-size: 0.75rem; color: #555; letter-spacing: 2px; text-transform: uppercase;">
          Titan Fitness Club · FC Road, Shivajinagar, Pune 411005
        </p>
        <p style="margin: 6px 0 0; font-size: 0.75rem; color: #555;">
          +91 98765 43210 · info@titanfitness.com
        </p>
      </div>
    </div>
  `,
});

// 2. User ला confirmation email
const contactConfirmationEmail = (data) => ({
  from: `"Titan Fitness Club" <${process.env.EMAIL_USER}>`,
  to: data.email,
  subject: `Thank you ${data.firstName}! We received your inquiry.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f0ede8; padding: 0; border: 1px solid #333;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff4d00, #ff6b2b); padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; letter-spacing: 6px; color: white;">TITAN</h1>
        <p style="margin: 5px 0 0; font-size: 0.75rem; letter-spacing: 4px; color: rgba(255,255,255,0.8);">FITNESS CLUB · PUNE</p>
      </div>

      <!-- Body -->
      <div style="padding: 36px;">
        <h2 style="color: #ff4d00; font-size: 1.3rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">
          Message Received! 💪
        </h2>

        <p style="color: #c8c2ba; line-height: 1.8; margin-bottom: 20px;">
          Hi <strong style="color: #fff;">${data.firstName}</strong>,
        </p>
        <p style="color: #c8c2ba; line-height: 1.8; margin-bottom: 20px;">
          Thank you for reaching out to <strong style="color: #ff4d00;">Titan Fitness Club</strong>. 
          We have received your inquiry and our team will contact you within <strong style="color: #fff;">24 hours</strong>.
        </p>

        <div style="background: #1a1a1a; border: 1px solid #222; padding: 24px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px; font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; color: #888;">Your Inquiry Summary</h3>
          <p style="margin: 6px 0; font-size: 0.9rem;"><span style="color: #888;">Interested In:</span> <span style="color: #ff4d00;">${data.interest || 'General Inquiry'}</span></p>
          <p style="margin: 6px 0; font-size: 0.9rem;"><span style="color: #888;">Message:</span> <span style="color: #c8c2ba;">${data.message}</span></p>
        </div>

        <p style="color: #c8c2ba; line-height: 1.8; margin-bottom: 24px;">
          In the meantime, feel free to WhatsApp us directly for faster response:
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://wa.me/919876543210" style="display: inline-block; background: #25d366; color: white; padding: 14px 32px; text-decoration: none; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-size: 0.85rem;">
            WhatsApp Us Now
          </a>
        </div>
      </div>

      <!-- What to expect -->
      <div style="padding: 0 36px 36px;">
        <h3 style="font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 16px;">What Happens Next?</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="padding: 12px 16px; background: #1a1a1a; border-left: 3px solid #ff4d00; font-size: 0.9rem; color: #c8c2ba;">
            1. Our trainer will call you within 24 hours
          </div>
          <div style="padding: 12px 16px; background: #1a1a1a; border-left: 3px solid #ff4d00; font-size: 0.9rem; color: #c8c2ba;">
            2. Free consultation and gym tour
          </div>
          <div style="padding: 12px 16px; background: #1a1a1a; border-left: 3px solid #ff4d00; font-size: 0.9rem; color: #c8c2ba;">
            3. Customized fitness plan discussion
          </div>
          <div style="padding: 12px 16px; background: #1a1a1a; border-left: 3px solid #ff4d00; font-size: 0.9rem; color: #c8c2ba;">
            4. Start your transformation journey!
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 20px 36px; background: #0a0a0a; text-align: center;">
        <p style="margin: 0 0 6px; font-size: 0.85rem; color: #ff4d00; letter-spacing: 2px; text-transform: uppercase;">Build Strength. Transform Life.</p>
        <p style="margin: 0; font-size: 0.75rem; color: #555; letter-spacing: 1px;">
          FC Road, Shivajinagar, Pune 411005 · +91 98765 43210
        </p>
      </div>
    </div>
  `,
});

// 3. Membership Welcome Email
const membershipWelcomeEmail = (data) => ({
  from: `"Titan Fitness Club" <${process.env.EMAIL_USER}>`,
  to: data.email,
  subject: `Welcome to Titan Fitness Club! Your ${data.plan} membership is confirmed.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f0ede8; padding: 0; border: 1px solid #333;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff4d00, #ff6b2b); padding: 40px; text-align: center;">
        <h1 style="margin: 0 0 8px; font-size: 2rem; letter-spacing: 6px; color: white;">TITAN</h1>
        <p style="margin: 0; font-size: 0.75rem; letter-spacing: 4px; color: rgba(255,255,255,0.8);">FITNESS CLUB · PUNE</p>
        <div style="margin-top: 20px; font-size: 2rem;">💪</div>
      </div>

      <!-- Welcome -->
      <div style="padding: 36px; text-align: center;">
        <h2 style="font-size: 1.5rem; letter-spacing: 2px; text-transform: uppercase; color: #ff4d00; margin-bottom: 8px;">
          Welcome to the Family!
        </h2>
        <p style="color: #c8c2ba; font-size: 1rem; line-height: 1.7;">
          Congratulations <strong style="color: #fff;">${data.memberName}</strong>!<br/>
          Your <strong style="color: #ff4d00;">${data.plan} Plan</strong> membership is now active.
        </p>
      </div>

      <!-- Membership Card -->
      <div style="margin: 0 36px 36px; background: linear-gradient(135deg, #1a1a1a, #222); border: 1px solid #ff4d00; padding: 28px;">
        <h3 style="margin: 0 0 20px; font-size: 0.8rem; letter-spacing: 4px; text-transform: uppercase; color: #888;">Membership Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #2a2a2a; color: #888; font-size: 0.85rem;">Member Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #2a2a2a; font-weight: bold; text-align: right;">${data.memberName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #2a2a2a; color: #888; font-size: 0.85rem;">Plan</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #2a2a2a; color: #ff4d00; font-weight: bold; text-align: right;">${data.plan}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #2a2a2a; color: #888; font-size: 0.85rem;">Billing</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #2a2a2a; text-align: right;">${data.billingCycle}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 0.85rem;">Amount</td>
            <td style="padding: 10px 0; color: #e8b84b; font-weight: bold; font-size: 1.1rem; text-align: right;">Rs. ${Number(data.amount).toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <!-- Gym Info -->
      <div style="margin: 0 36px 36px; padding: 24px; background: #0f0f0f; border: 1px solid #1a1a1a;">
        <h3 style="margin: 0 0 16px; font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase; color: #888;">Gym Timing & Location</h3>
        <p style="margin: 6px 0; font-size: 0.9rem; color: #c8c2ba;">Mon-Sat: 5:30 AM – 10:30 PM</p>
        <p style="margin: 6px 0; font-size: 0.9rem; color: #c8c2ba;">Sunday: 7:00 AM – 8:00 PM</p>
        <p style="margin: 12px 0 6px; font-size: 0.9rem; color: #ff4d00;">FC Road, Shivajinagar, Pune 411005</p>
        <p style="margin: 6px 0; font-size: 0.9rem; color: #c8c2ba;">+91 98765 43210</p>
      </div>

      <!-- Footer -->
      <div style="padding: 24px 36px; background: #0a0a0a; text-align: center;">
        <p style="margin: 0 0 8px; font-size: 0.9rem; color: #ff4d00; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">
          Build Strength. Transform Life.
        </p>
        <p style="margin: 0; font-size: 0.75rem; color: #555;">
          See you at the gym! 💪
        </p>
      </div>
    </div>
  `,
});

// ── Send Email Function ───────────────────────────────────────────
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', mailOptions.to);
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  contactNotificationEmail,
  contactConfirmationEmail,
  membershipWelcomeEmail,
};
