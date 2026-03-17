import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import './Admin.css';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiCall = async (method, endpoint, body = null) => {
  const token = localStorage.getItem('titan_token');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const AdminLogin = () => {
  const { adminLogin, loading } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault(); await adminLogin(form.email, form.password); };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="nav-logo-icon">T</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>TITAN</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '4px', color: 'var(--orange)', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Sign In</h2>
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '36px' }}>Access the Titan Fitness admin dashboard</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} className="form-input" placeholder="admin@titanfitness.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} className="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="form-submit" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? <span className="spinner" /> : 'Sign In →'}
          </button>
        </form>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--gray)', textAlign: 'center', marginTop: '24px', textTransform: 'uppercase' }}>
          admin@titanfitness.com / admin123
        </p>
      </div>
    </div>
  );
};

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',  icon: '⚡' },
  { id: 'programs',    label: 'Programs',   icon: '🏋' },
  { id: 'trainers',    label: 'Trainers',   icon: '👤' },
  { id: 'contacts',    label: 'Contacts',   icon: '✉' },
  { id: 'memberships', label: 'Members',    icon: '💳' },
  { id: 'blogs',       label: 'Blog Posts', icon: '📝' },
];

const DashStat = ({ label, value, icon, color }) => (
  <div className="dash-stat">
    <div className="dash-stat-icon" style={{ color }}>{icon}</div>
    <div className="dash-stat-value">{value}</div>
    <div className="dash-stat-label">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const { adminUser, adminLogout, showToast } = useApp();
  const [activeTab,   setActiveTab]   = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [programs,    setPrograms]    = useState([]);
  const [trainers,    setTrainers]    = useState([]);
  const [contacts,    setContacts]    = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [blogs,       setBlogs]       = useState([]);
  const [fetchLoad,   setFetchLoad]   = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [formData,    setFormData]    = useState({});

  const fetchData = useCallback(async (tab) => {
    setFetchLoad(true);
    try {
      if (tab === 'dashboard') {
        const [pR, tR, cR, mR, bR] = await Promise.all([
          apiCall('GET', '/programs'),
          apiCall('GET', '/trainers'),
          apiCall('GET', '/contacts'),
          apiCall('GET', '/memberships'),
          apiCall('GET', '/blogs'),
        ]);
        setPrograms(pR.data || []);
        setTrainers(tR.data || []);
        setContacts(cR.data || []);
        setMemberships(mR.data || []);
        setBlogs(bR.data || []);
      }
      if (tab === 'programs')    { const r = await apiCall('GET', '/programs');    setPrograms(r.data || []); }
      if (tab === 'trainers')    { const r = await apiCall('GET', '/trainers');    setTrainers(r.data || []); }
      if (tab === 'contacts')    { const r = await apiCall('GET', '/contacts');    setContacts(r.data || []); }
      if (tab === 'memberships') { const r = await apiCall('GET', '/memberships'); setMemberships(r.data || []); }
      if (tab === 'blogs')       { const r = await apiCall('GET', '/blogs');       setBlogs(r.data || []); }
    } catch (err) {
      showToast('Fetch error: ' + err.message, 'error');
    } finally {
      setFetchLoad(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(activeTab); }, [activeTab, fetchData]);

  const openAdd  = (def) => { setEditItem(null); setFormData(def); setShowForm(true); };
  const openEdit = (item, keys) => {
    setEditItem(item);
    const d = {};
    keys.forEach(k => { d[k] = item[k] || ''; });
    setFormData(d);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditItem(null); setFormData({}); };

  const handleSave = async (endpoint, tab) => {
    try {
      if (editItem) {
        await apiCall('PUT', `/${endpoint}/${editItem._id}`, formData);
        showToast('Updated successfully!');
      } else {
        await apiCall('POST', `/${endpoint}`, formData);
        showToast('Added successfully!');
      }
      closeForm();
      fetchData(tab);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleDelete = async (endpoint, id, tab) => {
    if (!window.confirm('Delete करायचं आहे का?')) return;
    try {
      await apiCall('DELETE', `/${endpoint}/${id}`);
      showToast('Deleted!');
      fetchData(tab);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const markRead = async (id) => {
    try {
      await apiCall('PATCH', `/contacts/${id}/read`);
      setContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
      showToast('Marked as read');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const inp = { width: '100%', background: 'var(--dark3)', border: 'var(--border-dim)', color: 'var(--white)', padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none', marginBottom: '14px' };
  const lbl = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '6px' };
  const fd  = (k, v) => setFormData(prev => ({ ...prev, [k]: v }));

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth <= 900 && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-logo">
          <div className="nav-logo-icon" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>T</div>
          {sidebarOpen && <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>Titan Admin</span>}
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <button key={item.id} className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setShowForm(false); }}>
              <span className="admin-nav-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          {sidebarOpen && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase', marginBottom: '10px' }}>{adminUser?.name}</div>}
          <button className="admin-logout-btn" onClick={adminLogout}><span>🚪</span>{sidebarOpen && ' Logout'}</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="admin-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className="admin-page-title">{navItems.find(n => n.id === activeTab)?.label}</h1>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase' }}>
            {fetchLoad ? 'Loading...' : `Welcome, ${adminUser?.name} 👋`}
          </div>
        </header>

        <div className="admin-content">

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="dash-stats-grid">
                <DashStat label="Active Members"     value={memberships.length} icon="👥" color="var(--orange)" />
                <DashStat label="Total Programs"     value={programs.length}    icon="🏋" color="var(--gold2)"  />
                <DashStat label="Certified Trainers" value={trainers.length}    icon="⭐" color="#4ade80"       />
                <DashStat label="New Inquiries"      value={contacts.filter(c => !c.isRead).length} icon="✉" color="#60a5fa" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginTop: '2px' }}>
                <div className="admin-card">
                  <h3 className="admin-card-title">Recent Inquiries</h3>
                  {contacts.length === 0 && <p style={{ color: 'var(--gray)' }}>No inquiries yet.</p>}
                  {contacts.slice(0, 5).map(c => (
                    <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: 'var(--border-dim)' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>{c.firstName} {c.lastName}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', textTransform: 'uppercase' }}>{c.interest || 'General'}</div>
                      </div>
                      {!c.isRead && <span style={{ background: 'var(--orange)', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '2px', padding: '3px 8px', textTransform: 'uppercase' }}>NEW</span>}
                    </div>
                  ))}
                </div>
                <div className="admin-card">
                  <h3 className="admin-card-title">Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[['+ Add Program','programs'],['+ Add Trainer','trainers'],['+ Add Blog Post','blogs'],['View Contacts','contacts'],['View Members','memberships']].map(([label, tab]) => (
                      <button key={label} onClick={() => setActiveTab(tab)}
                        style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '12px 16px', background: 'var(--dark3)', border: 'var(--border-dim)', color: 'var(--white2)', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,77,0,0.4)'; e.currentTarget.style.color = 'var(--orange)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = 'var(--white2)'; }}
                      >{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROGRAMS */}
          {activeTab === 'programs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ color: 'var(--gray)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{programs.length} Programs</p>
                <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 22px' }} onClick={() => openAdd({ title: '', category: 'Weight Training', price: '', duration: '', description: '', level: 'Beginner', image: '' })}>+ Add Program</button>
              </div>
              {showForm && (
                <div className="admin-card" style={{ marginBottom: '20px' }}>
                  <h3 className="admin-card-title">{editItem ? 'Edit Program' : 'Add New Program'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={lbl}>Title</label><input style={inp} value={formData.title || ''} onChange={e => fd('title', e.target.value)} placeholder="Program Title" /></div>
                    <div><label style={lbl}>Category</label>
                      <select style={inp} value={formData.category || ''} onChange={e => fd('category', e.target.value)}>
                        {['Weight Training','CrossFit','Fat Loss','Strength Training','Personal Training','Bodybuilding'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label style={lbl}>Price (Rs)</label><input style={inp} type="number" value={formData.price || ''} onChange={e => fd('price', e.target.value)} placeholder="2999" /></div>
                    <div><label style={lbl}>Duration</label><input style={inp} value={formData.duration || ''} onChange={e => fd('duration', e.target.value)} placeholder="8 Weeks" /></div>
                    <div><label style={lbl}>Level</label>
                      <select style={inp} value={formData.level || 'Beginner'} onChange={e => fd('level', e.target.value)}>
                        {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div><label style={lbl}>Image URL</label><input style={inp} value={formData.image || ''} onChange={e => fd('image', e.target.value)} placeholder="https://..." /></div>
                  </div>
                  <div><label style={lbl}>Description</label><textarea style={{ ...inp, height: '90px', resize: 'vertical' }} value={formData.description || ''} onChange={e => fd('description', e.target.value)} placeholder="Program description..." /></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={() => handleSave('programs', 'programs')}>{editItem ? 'Update' : 'Save'}</button>
                    <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={closeForm}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Program</th><th>Category</th><th>Duration</th><th>Price</th><th>Level</th><th>Actions</th></tr></thead>
                  <tbody>
                    {programs.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--gray)', padding: '30px' }}>No programs found</td></tr>}
                    {programs.map(p => (
                      <tr key={p._id}>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>{p.title}</td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--orange)', textTransform: 'uppercase' }}>{p.category}</span></td>
                        <td style={{ color: 'var(--white2)' }}>{p.duration}</td>
                        <td style={{ color: 'var(--gold2)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Rs.{Number(p.price).toLocaleString('en-IN')}</td>
                        <td style={{ color: 'var(--white2)' }}>{p.level}</td>
                        <td><div style={{ display: 'flex', gap: '8px' }}>
                          <button className="admin-action-btn edit" onClick={() => openEdit(p, ['title','category','price','duration','description','level','image'])}>Edit</button>
                          <button className="admin-action-btn delete" onClick={() => handleDelete('programs', p._id, 'programs')}>Delete</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TRAINERS */}
          {activeTab === 'trainers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ color: 'var(--gray)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{trainers.length} Trainers</p>
                <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 22px' }} onClick={() => openAdd({ name: '', specialization: '', bio: '', experience: '', photo: '' })}>+ Add Trainer</button>
              </div>
              {showForm && (
                <div className="admin-card" style={{ marginBottom: '20px' }}>
                  <h3 className="admin-card-title">{editItem ? 'Edit Trainer' : 'Add New Trainer'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={lbl}>Full Name</label><input style={inp} value={formData.name || ''} onChange={e => fd('name', e.target.value)} placeholder="Trainer Name" /></div>
                    <div><label style={lbl}>Specialization</label><input style={inp} value={formData.specialization || ''} onChange={e => fd('specialization', e.target.value)} placeholder="CrossFit & HIIT" /></div>
                    <div><label style={lbl}>Experience (Years)</label><input style={inp} type="number" value={formData.experience || ''} onChange={e => fd('experience', e.target.value)} placeholder="5" /></div>
                    <div><label style={lbl}>Photo URL</label><input style={inp} value={formData.photo || ''} onChange={e => fd('photo', e.target.value)} placeholder="https://..." /></div>
                  </div>
                  <div><label style={lbl}>Bio</label><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={formData.bio || ''} onChange={e => fd('bio', e.target.value)} placeholder="Trainer bio..." /></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={() => handleSave('trainers', 'trainers')}>{editItem ? 'Update' : 'Save'}</button>
                    <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={closeForm}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Trainer</th><th>Specialization</th><th>Experience</th><th>Actions</th></tr></thead>
                  <tbody>
                    {trainers.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--gray)', padding: '30px' }}>No trainers found</td></tr>}
                    {trainers.map(t => (
                      <tr key={t._id}>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {t.photo && <img src={t.photo} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>{t.name}</span>
                        </div></td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--orange)', textTransform: 'uppercase' }}>{t.specialization}</span></td>
                        <td style={{ color: 'var(--white2)' }}>{t.experience} yrs</td>
                        <td><div style={{ display: 'flex', gap: '8px' }}>
                          <button className="admin-action-btn edit" onClick={() => openEdit(t, ['name','specialization','bio','experience','photo'])}>Edit</button>
                          <button className="admin-action-btn delete" onClick={() => handleDelete('trainers', t._id, 'trainers')}>Delete</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === 'contacts' && (
            <div>
              <p style={{ color: 'var(--gray)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
                {contacts.filter(c => !c.isRead).length} unread · {contacts.length} total
              </p>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Interest</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {contacts.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray)', padding: '30px' }}>No contacts yet</td></tr>}
                    {contacts.map(c => (
                      <tr key={c._id} style={{ opacity: c.isRead ? 0.6 : 1 }}>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>{c.firstName} {c.lastName}</td>
                        <td style={{ color: 'var(--white2)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{c.email}</td>
                        <td style={{ color: 'var(--white2)' }}>{c.phone || '-'}</td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--orange)', textTransform: 'uppercase' }}>{c.interest || 'General'}</span></td>
                        <td style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>{c.isRead ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Read</span> : <span style={{ background: 'var(--orange)', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'white', padding: '3px 8px', textTransform: 'uppercase' }}>New</span>}</td>
                        <td>{!c.isRead && <button className="admin-action-btn edit" onClick={() => markRead(c._id)}>Mark Read</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MEMBERSHIPS */}
          {activeTab === 'memberships' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ color: 'var(--gray)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{memberships.length} Members</p>
                <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 22px' }} onClick={() => openAdd({ memberName: '', email: '', phone: '', plan: 'Basic', billingCycle: 'monthly', amount: '' })}>+ Add Member</button>
              </div>
              {showForm && (
                <div className="admin-card" style={{ marginBottom: '20px' }}>
                  <h3 className="admin-card-title">{editItem ? 'Edit Member' : 'Add New Member'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><label style={lbl}>Member Name</label><input style={inp} value={formData.memberName || ''} onChange={e => fd('memberName', e.target.value)} placeholder="Full Name" /></div>
                    <div><label style={lbl}>Email</label><input style={inp} type="email" value={formData.email || ''} onChange={e => fd('email', e.target.value)} placeholder="email@example.com" /></div>
                    <div><label style={lbl}>Phone</label><input style={inp} value={formData.phone || ''} onChange={e => fd('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
                    <div><label style={lbl}>Plan</label>
                      <select style={inp} value={formData.plan || 'Basic'} onChange={e => fd('plan', e.target.value)}>
                        {['Basic','Pro','Elite'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div><label style={lbl}>Billing Cycle</label>
                      <select style={inp} value={formData.billingCycle || 'monthly'} onChange={e => fd('billingCycle', e.target.value)}>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div><label style={lbl}>Amount (Rs)</label><input style={inp} type="number" value={formData.amount || ''} onChange={e => fd('amount', e.target.value)} placeholder="2999" /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={() => handleSave('memberships/enroll', 'memberships')}>{editItem ? 'Update' : 'Save'}</button>
                    <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={closeForm}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Member</th><th>Email</th><th>Phone</th><th>Plan</th><th>Billing</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {memberships.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray)', padding: '30px' }}>No members yet</td></tr>}
                    {memberships.map(m => (
                      <tr key={m._id}>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>{m.memberName}</td>
                        <td style={{ color: 'var(--white2)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{m.email}</td>
                        <td style={{ color: 'var(--white2)' }}>{m.phone}</td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--orange)', textTransform: 'uppercase' }}>{m.plan}</span></td>
                        <td style={{ color: 'var(--white2)' }}>{m.billingCycle}</td>
                        <td style={{ color: 'var(--gold2)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Rs.{Number(m.amount).toLocaleString('en-IN')}</td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', background: m.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(255,77,0,0.15)', color: m.status === 'active' ? '#4ade80' : 'var(--orange)', padding: '3px 10px', textTransform: 'uppercase' }}>{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BLOGS */}
          {activeTab === 'blogs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ color: 'var(--gray)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{blogs.length} Blog Posts</p>
                <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 22px' }} onClick={() => openAdd({ title: '', excerpt: '', content: '', category: 'Workout', image: '' })}>+ Add Blog Post</button>
              </div>
              {showForm && (
                <div className="admin-card" style={{ marginBottom: '20px' }}>
                  <h3 className="admin-card-title">{editItem ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Title</label><input style={inp} value={formData.title || ''} onChange={e => fd('title', e.target.value)} placeholder="Blog Post Title" /></div>
                    <div><label style={lbl}>Category</label>
                      <select style={inp} value={formData.category || 'Workout'} onChange={e => fd('category', e.target.value)}>
                        {['Workout','Nutrition','Mindset','Lifestyle'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label style={lbl}>Image URL</label><input style={inp} value={formData.image || ''} onChange={e => fd('image', e.target.value)} placeholder="https://..." /></div>
                  </div>
                  <div><label style={lbl}>Excerpt</label><textarea style={{ ...inp, height: '70px', resize: 'vertical' }} value={formData.excerpt || ''} onChange={e => fd('excerpt', e.target.value)} placeholder="Short description..." /></div>
                  <div><label style={lbl}>Content (Full Article)</label><textarea style={{ ...inp, height: '150px', resize: 'vertical' }} value={formData.content || ''} onChange={e => fd('content', e.target.value)} placeholder="Full blog post content..." /></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={() => handleSave('blogs', 'blogs')}>{editItem ? 'Update' : 'Publish'}</button>
                    <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '12px 28px' }} onClick={closeForm}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Title</th><th>Category</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {blogs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--gray)', padding: '30px' }}>No blog posts yet</td></tr>}
                    {blogs.map(b => (
                      <tr key={b._id}>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', maxWidth: '300px' }}>{b.title}</td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--orange)', textTransform: 'uppercase' }}>{b.category}</span></td>
                        <td style={{ color: 'var(--white2)' }}>{b.views || 0}</td>
                        <td style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><div style={{ display: 'flex', gap: '8px' }}>
                          <button className="admin-action-btn edit" onClick={() => openEdit(b, ['title','excerpt','content','category','image'])}>Edit</button>
                          <button className="admin-action-btn delete" onClick={() => handleDelete('blogs', b._id, 'blogs')}>Delete</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { isAdmin } = useApp();
  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
};

export default Admin;