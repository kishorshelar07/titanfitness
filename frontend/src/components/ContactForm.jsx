import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './ContactForm.css';

const initialState = {
  firstName: '', lastName: '', email: '',
  phone: '', interest: '', message: '',
};

const ContactForm = () => {
  const { submitContact } = useApp();
  const [form,    setForm]    = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) return;
    setLoading(true);
    const res = await submitContact(form);
    setLoading(false);
    if (res.success) { setSent(true); setForm(initialState); }
  };

  if (sent) return (
    <div className="form-success">
      <div className="success-icon">✓</div>
      <h3>Message Sent!</h3>
      <p>We'll contact you within 24 hours.</p>
      <button className="btn-primary" onClick={() => setSent(false)}>Send Another</button>
    </div>
  );

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input name="firstName" value={form.firstName} onChange={handle}
            className="form-input" placeholder="Rahul" required />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handle}
            className="form-input" placeholder="Mehta" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input type="email" name="email" value={form.email} onChange={handle}
          className="form-input" placeholder="rahul@email.com" required />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input type="tel" name="phone" value={form.phone} onChange={handle}
          className="form-input" placeholder="+91 98765 43210" />
      </div>

      <div className="form-group">
        <label className="form-label">Interested In</label>
        <select name="interest" value={form.interest} onChange={handle} className="form-input">
          <option value="">Select a Program</option>
          {['Weight Training','CrossFit','Fat Loss','Strength Training',
            'Personal Training','Bodybuilding','Membership Inquiry'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea name="message" value={form.message} onChange={handle}
          className="form-input form-textarea"
          placeholder="Tell us about your fitness goals..."
          required rows={5} />
      </div>

      <button type="submit" className="form-submit" disabled={loading}>
        {loading ? <span className="spinner" /> : '⚡ Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
