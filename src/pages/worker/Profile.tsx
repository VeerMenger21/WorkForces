import { useState, useEffect, type FormEvent } from 'react';
import { useStore } from '../../context';
import { locations, trades } from '../../seedData';
import { UserRound, BriefcaseBusiness, Sparkles, ShieldCheck, Save, Plus, X, Star, AlertCircle } from 'lucide-react';

export function Profile() {
  const { worker, setWorker, getRatingsForRecipient, getRatingSummary, addToast } = useStore();

  const [name, setName] = useState(worker.name);
  const [trade, setTrade] = useState(worker.trade);
  const [experience, setExperience] = useState(worker.experience);
  const [neighborhood, setNeighborhood] = useState(worker.neighborhood || 'Andheri East');
  const [city, setCity] = useState<'Mumbai' | 'Navi Mumbai'>(worker.city || 'Mumbai');
  const [phone, setPhone] = useState(worker.phone);
  const [dailyRate, setDailyRate] = useState<number | ''>(worker.dailyRate || 850);
  const [workExperience, setWorkExperience] = useState(
    worker.workExperience || worker.sample || 'Residential wiring, switchboard fitting, and apartment rewiring'
  );
  const [aboutMe, setAboutMe] = useState(
    worker.aboutMe || worker.intro || 'Electrician with 8 years of experience. I focus on safe, reliable work and arriving on time.'
  );
  const [skills, setSkills] = useState<string[]>(
    worker.skills || ['Residential wiring', 'Switchboards', 'Inverter setup']
  );
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form when active worker is changed in the switcher
  useEffect(() => {
    setName(worker.name);
    setTrade(worker.trade);
    setExperience(worker.experience);
    setNeighborhood(worker.neighborhood || 'Andheri East');
    setCity(worker.city || 'Mumbai');
    setPhone(worker.phone);
    setDailyRate(worker.dailyRate || 850);
    setWorkExperience(worker.workExperience || worker.sample || '');
    setAboutMe(worker.aboutMe || worker.intro || '');
    setSkills(worker.skills || []);
    setErrors({});
  }, [worker.id]);

  const workerReviews = getRatingsForRecipient(worker.id);
  const ratingSummary = getRatingSummary(worker.id, worker.rating || 4.9, worker.reviewCount || 42);

  const addSkill = () => {
    const normalized = newSkill.trim();
    if (!normalized) return;
    if (normalized.length > 40 || skills.length >= 20 || skills.some(skill => skill.toLowerCase() === normalized.toLowerCase())) return;
    setSkills([...skills, normalized]);
    setNewSkill('');
    setErrors(prev => ({ ...prev, skills: '' }));
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    setErrors(prev => ({ ...prev, skills: '' }));
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3 || name.trim().length > 80) {
      errs.name = 'Enter your full name (3 to 80 characters).';
    }

    // Phone validation: allow common formatting, but require exactly ten digits.
    const rawDigits = phone.replace(/\D/g, '');
    const digitsOnly = rawDigits.length === 12 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
    if (!/^\d{10}$/.test(digitsOnly)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (dailyRate === '' || !Number.isFinite(Number(dailyRate)) || Number(dailyRate) < 400 || Number(dailyRate) > 100000000 || !Number.isInteger(Number(dailyRate))) {
      errs.dailyRate = 'Daily rate must be a whole amount between ₹400 and ₹10 crore.';
    }

    if (!workExperience.trim() || workExperience.trim().length < 10 || workExperience.trim().length > 1000) {
      errs.workExperience = 'Describe your work experience in 10 to 1,000 characters.';
    }

    if (!aboutMe.trim() || aboutMe.trim().length < 10 || aboutMe.trim().length > 1000) {
      errs.aboutMe = 'Write a short bio in 10 to 1,000 characters.';
    }

    if (!experience.trim() || experience.trim().length < 2 || experience.trim().length > 60) {
      errs.experience = 'Enter your experience in 2 to 60 characters.';
    }

    if (!trades.includes(trade)) errs.trade = 'Choose a valid primary trade.';
    if (city !== 'Mumbai' && city !== 'Navi Mumbai') errs.neighborhood = 'Choose a valid city.';
    if (!locations.some(location => location.city === city && location.neighborhood === neighborhood)) {
      errs.neighborhood = 'Choose a locality that belongs to the selected city.';
    }
    if (skills.length < 1 || skills.length > 20 || skills.some(skill => !skill.trim() || skill.trim().length > 40) || new Set(skills.map(skill => skill.trim().toLowerCase())).size !== skills.length) {
      errs.skills = 'Keep 1 to 20 unique skills, each between 1 and 40 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please correct the errors in the profile form.', 'warning');
      return;
    }

    const rawDigits = phone.replace(/\D/g, '');
    const digitsOnly = rawDigits.length === 12 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;

    const targetLoc = locations.find(l => l.neighborhood === neighborhood) || {
      city,
      neighborhood,
      displayName: `${neighborhood}, ${city}`
    };

    setWorker({
      ...worker,
      name: name.trim(),
      trade,
      experience,
      neighborhood: targetLoc.neighborhood,
      city: targetLoc.city,
      area: targetLoc.displayName,
      phone: digitsOnly,
      dailyRate: Number(dailyRate) || 850,
      workExperience: workExperience.trim(),
      aboutMe: aboutMe.trim(),
      sample: workExperience.trim(),
      intro: aboutMe.trim(),
      skills
    });
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="worker-profile-page">
      {/* Page Title */}
      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> DIGITAL NAKA IDENTITY
          </div>
          <h1 className="page-main-title">Your Skills, In Your Words.</h1>
          <p className="page-main-subtitle">
            A clear profile allows local contractors and homeowners to find you and offer work matching your rates.
          </p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Left: edit form */}
        <div className="profile-form-col">
      <form onSubmit={handleSave} className="worker-profile-form" noValidate>
            <div className="form-section-header">
              <span className="step-num">01</span>
              <div>
                <h3 className="section-heading">Basic Information</h3>
                <small className="section-subtext">How contractors identify and contact you.</small>
              </div>
            </div>

            <div className="fields-grid-2col">
              <label className="field-block">
                <span className="field-label">Full Name *</span>
                <input
                  type="text"
                  className={`text-input ${errors.name ? 'is-invalid' : ''}`}
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  required
                  maxLength={80}
                />
                {errors.name && <span className="field-error-msg">{errors.name}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Mobile Number *</span>
                <input
                  type="tel"
                  className={`text-input ${errors.phone ? 'is-invalid' : ''}`}
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  required
                  maxLength={16}
                />
                {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Primary Trade *</span>
                <select
                  className="select-input"
                  value={trade}
                  onChange={e => {
                    setTrade(e.target.value);
                    setErrors(prev => ({ ...prev, trade: '' }));
                  }}
                  aria-invalid={Boolean(errors.trade)}
                >
                  {trades.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.trade && <span className="field-error-msg">{errors.trade}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Practical Experience *</span>
                <input
                  type="text"
                  className={`text-input ${errors.experience ? 'is-invalid' : ''}`}
                  placeholder="e.g. 8 years"
                  value={experience}
                  onChange={e => {
                    setExperience(e.target.value);
                    if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
                  }}
                  required
                  maxLength={60}
                />
                {errors.experience && <span className="field-error-msg">{errors.experience}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Primary City</span>
                <select
                  className="select-input"
                  value={city}
                  onChange={e => {
                    const newCity = e.target.value as 'Mumbai' | 'Navi Mumbai';
                    setCity(newCity);
                    const firstNeigh = locations.find(l => l.city === newCity);
                    if (firstNeigh) setNeighborhood(firstNeigh.neighborhood);
                    setErrors(prev => ({ ...prev, neighborhood: '' }));
                  }}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                </select>
              </label>

              <label className="field-block">
                <span className="field-label">Neighborhood / Chowk Locality</span>
                <select
                  className="select-input"
                  value={neighborhood}
                  onChange={e => {
                    setNeighborhood(e.target.value);
                    setErrors(prev => ({ ...prev, neighborhood: '' }));
                  }}
                  aria-invalid={Boolean(errors.neighborhood)}
                >
                  {locations
                    .filter(l => l.city === city)
                    .map(l => (
                      <option key={`${l.city}-${l.neighborhood}`} value={l.neighborhood}>
                        {l.neighborhood}
                      </option>
                    ))}
                </select>
                {errors.neighborhood && <span className="field-error-msg">{errors.neighborhood}</span>}
              </label>

              <label className="field-block full-width">
                <span className="field-label">Expected Daily Wage (₹ / day) *</span>
                <input
                  type="number"
                  className={`text-input ${errors.dailyRate ? 'is-invalid' : ''}`}
                  min={400}
                  step={50}
                  value={dailyRate}
                  onChange={e => {
                    setDailyRate(e.target.value === '' ? '' : Number(e.target.value));
                    if (errors.dailyRate) setErrors(prev => ({ ...prev, dailyRate: '' }));
                  }}
                  required
                  max={100000000}
                />
                {errors.dailyRate && <span className="field-error-msg">{errors.dailyRate}</span>}
              </label>
            </div>

            {/* Section 02: work experience */}
            <div className="form-section-header">
              <span className="step-num">02</span>
              <div>
                <h3 className="section-heading">{"Work Experience"}</h3>
                <small className="section-subtext">
                  Describe previous projects completed, familiar tools, or past sites in plain language.
                </small>
              </div>
            </div>

            <div className="field-block full-width">
              <label className="field-label">{"Work Experience Summary"} *</label>
              <textarea
                className={`textarea-input ${errors.workExperience ? 'is-invalid' : ''}`}
                rows={3}
                placeholder="e.g. 2BHK flat rewiring, distribution box MCB setup, inverter connections, emergency short-circuit repairs. Have standard insulated tools and multi-meter."
                value={workExperience}
                onChange={e => {
                  setWorkExperience(e.target.value);
                  if (errors.workExperience) setErrors(prev => ({ ...prev, workExperience: '' }));
                }}
                required
                  maxLength={1000}
              />
              {errors.workExperience && <span className="field-error-msg">{errors.workExperience}</span>}
            </div>

            {/* Skills & Specialties */}
            <div className="field-block full-width">
              <span className="field-label">Key Specialties & Skills</span>
              <div className="skills-chips-editor">
                {skills.map(skill => (
                  <span key={skill} className="skill-edit-tag">
                    {skill}
                    <button
                      type="button"
                      className="skill-remove-btn"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="add-skill-row">
                <input
                  type="text"
                  className="text-input"
                  placeholder="Add specialty (e.g. DB dressing, Inverter setup)..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  maxLength={40}
                />
                <button type="button" className="btn-outline-small" onClick={addSkill} disabled={!newSkill.trim() || newSkill.trim().length > 40 || skills.length >= 20 || skills.some(skill => skill.toLowerCase() === newSkill.trim().toLowerCase())}>
                  <Plus size={14} /> Add
                </button>
              </div>
              {errors.skills && <span className="field-error-msg">{errors.skills}</span>}
            </div>

            {/* Section 03: about me */}
            <div className="form-section-header">
              <span className="step-num">03</span>
              <div>
                <h3 className="section-heading">{"About Me"}</h3>
                <small className="section-subtext">
                  {"Tell employers a little about yourself and how you work."}
                </small>
              </div>
            </div>

            <div className="field-block full-width">
              <label className="field-label">My Bio *</label>
              <textarea
                className={`textarea-input ${errors.aboutMe ? 'is-invalid' : ''}`}
                rows={3}
                placeholder="e.g. Electrician with 8 years of experience. I focus on safe, reliable work and arriving on time."
                value={aboutMe}
                onChange={e => {
                  setAboutMe(e.target.value);
                  if (errors.aboutMe) setErrors(prev => ({ ...prev, aboutMe: '' }));
                }}
                required
                maxLength={1000}
              />
              <small className="field-helper-text">
                Keep it simple and personal — like an Instagram bio in your own words.
              </small>
              {errors.aboutMe && <span className="field-error-msg">{errors.aboutMe}</span>}
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="form-error-banner">
                <AlertCircle size={16} />
                <span>Please fix the highlighted errors before saving.</span>
              </div>
            )}

            <div className="form-submit-row">
              <button type="submit" className="btn-primary-large">
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right: live profile preview */}
        <aside className="profile-preview-col">
          <div className="preview-sticky-card">
            <div className="preview-label-tag">
              <Sparkles size={14} /> PUBLIC PROFILE PREVIEW
            </div>

            <div className="worker-preview-display-card">
              <div className="preview-avatar-banner">
                <div className="preview-avatar-circle">{worker.photo}</div>
                <div className="preview-avatar-badges">
                  <span className={`status-pill-small ${worker.available ? 'pill-online' : 'pill-offline'}`}>
                    <span className="dot" />
                    {worker.available ? 'Available Today' : 'Away'}
                  </span>
                  {worker.verified && (
                    <span className="pill-verified">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="preview-worker-body">
                <span className="trade-pill-detail">{trade}</span>
                <h3 className="preview-worker-name">{name || 'Your Name'}</h3>
                <p className="preview-worker-sub">
                  {experience} practical experience · {neighborhood}, {city}
                </p>

                <div className="preview-rate-box">
                  <span className="rate-sub">Standard Day Rate</span>
                  <strong className="rate-val">₹{dailyRate || 850} / day</strong>
                </div>

                <div className="preview-section-item">
                  <h5 className="preview-item-title">
                    <BriefcaseBusiness size={14} /> Work Experience
                  </h5>
                  <p className="preview-item-text">{workExperience}</p>
                </div>

                <div className="preview-section-item">
                  <h5 className="preview-item-title">
                    <UserRound size={14} /> About Me
                  </h5>
                  <p className="preview-item-text">{aboutMe}</p>
                </div>

                {skills.length > 0 && (
                  <div className="preview-skills-strip">
                    {skills.map(s => (
                      <span key={s} className="preview-skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Verified Reviews Section (Requirement 7) */}
            <div className="profile-reviews-section">
              <div className="profile-section-title">
                <h3>
                  <Star size={16} fill="#ea7e24" stroke="#ea7e24" /> Client Reviews & Ratings
                </h3>
                <span className="rating-stat-pill">
                  ★ {ratingSummary.rating} ({ratingSummary.count} verified)
                </span>
              </div>

              {workerReviews.length > 0 ? (
                <div className="reviews-list-grid">
                  {workerReviews.map(r => (
                    <div key={r.id} className="review-card-item">
                      <div className="review-header-row">
                        <div className="review-author-info">
                          <span className="review-author-name">{r.reviewerName}</span>
                          <span className="review-role-badge">Employer</span>
                        </div>
                        <span className="review-time-stamp">{r.createdAt}</span>
                      </div>
                      <div className="review-stars-box">
                        {[1, 2, 3, 4, 5].map(st => (
                          <Star
                            key={st}
                            size={13}
                            fill={st <= r.rating ? '#ea7e24' : '#cbd5e1'}
                            stroke={st <= r.rating ? '#ea7e24' : '#cbd5e1'}
                          />
                        ))}
                        <span>({r.rating}.0)</span>
                      </div>
                      {r.categories.length > 0 && (
                        <div className="review-categories-pills">
                          {r.categories.map((c, i) => (
                            <span key={i} className="review-cat-tag">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {r.comment && <p className="review-comment-box">"{r.comment}"</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reviews-empty">
                  <span>ℹ️ No individual written reviews recorded yet. Standard rating is ★ 4.9.</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
