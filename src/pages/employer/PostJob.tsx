import { useState, useMemo, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context';
import { Job, EmploymentType, WageUnit } from '../../types';
import { locations, trades } from '../../seedData';
import { getTradeIcon } from '../../components/JobCard';
import { getEmploymentTypeLabel, getEmploymentTypeBadgeClass } from '../../utils/matching';
import { ArrowLeft, ArrowRight, Plus, CheckCircle2, MapPin, Clock3, ShieldCheck, AlertCircle, Eye, Sparkles, Users, Award } from 'lucide-react';

// Urban Company style benchmark fair daily wages per trade
const STANDARD_TRADE_RATES: Record<string, { daily: number; monthly: number; label: string }> = {
  Electrician: { daily: 900, monthly: 24000, label: '₹850 – ₹1,100 / day' },
  Plumber: { daily: 900, monthly: 24000, label: '₹850 – ₹1,100 / day' },
  Carpenter: { daily: 950, monthly: 26000, label: '₹900 – ₹1,200 / day' },
  Painter: { daily: 800, monthly: 22000, label: '₹750 – ₹1,000 / day' },
  'Civil Mason': { daily: 950, monthly: 25000, label: '₹900 – ₹1,150 / day' },
  Welder: { daily: 900, monthly: 24000, label: '₹850 – ₹1,100 / day' },
  Helper: { daily: 650, monthly: 17000, label: '₹600 – ₹800 / day' },
  'Tile Layer': { daily: 950, monthly: 25000, label: '₹900 – ₹1,200 / day' },
  'Cleaning & Sanitation': { daily: 650, monthly: 16500, label: '₹600 – ₹800 / day' }
};

export function PostJob() {
  const navigate = useNavigate();
  const { jobs, setJobs, addToast, currentEmployer } = useStore();

  // Basic job information
  const [title, setTitle] = useState('');
  const [trade, setTrade] = useState('Electrician');
  const [description, setDescription] = useState('');
  const [workersCount, setWorkersCount] = useState(1);
  const [date, setDate] = useState('Today');

  // Employment Type / Duration (Requirement 8)
  const [employmentType, setEmploymentType] = useState<EmploymentType>('daily');
  const [wageUnit, setWageUnit] = useState<WageUnit>('day');
  const [duration, setDuration] = useState('1 day');

  // Location (City & Neighborhood)
  const [selectedCity, setSelectedCity] = useState<'Mumbai' | 'Navi Mumbai'>('Mumbai');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Andheri East');
  const [siteAddress, setSiteAddress] = useState('Azad Road, Near Metro Station');

  // Wages and Schedule
  const [wage, setWage] = useState<number | ''>(850);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [workSchedule, setWorkSchedule] = useState('Monday – Saturday, 9:00 AM – 6:00 PM');
  const [payment, setPayment] = useState('Same day via UPI or Cash (Recommended)');
  const [tools, setTools] = useState('Bring personal hand tools; heavy tools & materials provided on site');
  const [safetyGear, setSafetyGear] = useState('Standard safety shoes/gear recommended');

  // Compatible trades
  const [compatibleTrades, setCompatibleTrades] = useState<string[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postedSuccess, setPostedSuccess] = useState(false);

  // Available neighborhoods based on selected city
  const cityNeighborhoods = useMemo(() => {
    return locations.filter(l => l.city === selectedCity);
  }, [selectedCity]);

  // Urban Company standard rate benchmark
  const standardRate = STANDARD_TRADE_RATES[trade] || { daily: 850, monthly: 24000, label: '₹800 – ₹1,000 / day' };

  // Adjust default wageUnit and duration when employment type changes
  const handleEmploymentTypeChange = (type: EmploymentType) => {
    setEmploymentType(type);
    if (type === 'daily') {
      setWageUnit('day');
      setDuration('1 day');
      setWage(standardRate.daily);
      setPayment('Same day via UPI or Cash (Recommended)');
    } else if (type === 'contract') {
      setWageUnit('total');
      setDuration('10–14 days');
      setWage(standardRate.daily * 12);
      setPayment('30% advance, balance on milestone handover');
    } else if (type === 'weekly') {
      setWageUnit('week');
      setDuration('2–4 weeks');
      setWage(standardRate.daily * 6);
      setPayment('Weekly settlement every Saturday');
    } else if (type === 'monthly') {
      setWageUnit('month');
      setDuration('Ongoing (Monthly)');
      setWage(standardRate.monthly);
      setPayment('Monthly bank transfer / UPI on 1st of every month');
    } else if (type === 'long_term') {
      setWageUnit('month');
      setDuration('Long-term permanent / ongoing');
      setWage(standardRate.monthly + 2000);
      setPayment('Monthly payroll with attendance register & festive bonus');
    }
  };

  const toggleCompatibleTrade = (t: string) => {
    setCompatibleTrades(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 5) {
      errs.title = 'Job title must be at least 5 characters.';
    } else if (title.trim().length > 100) {
      errs.title = 'Job title must be 100 characters or fewer.';
    }

    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please provide a clear work description (at least 15 characters).';
    } else if (description.trim().length > 2000) {
      errs.description = 'Description must be 2,000 characters or fewer.';
    }

    if (!siteAddress.trim() || siteAddress.trim().length < 5) {
      errs.siteAddress = 'Please enter a valid site address / street landmark.';
    } else if (siteAddress.trim().length > 200) {
      errs.siteAddress = 'Site address must be 200 characters or fewer.';
    }

    if (wage === '' || !Number.isFinite(Number(wage)) || Number(wage) <= 0 || Number(wage) > 100000000 || !Number.isInteger(Number(wage))) {
      errs.wage = 'Please specify a valid wage amount.';
    } else if (wageUnit === 'day' && Number(wage) < 400) {
      errs.wage = 'Daily wage must be at least ₹400/day (minimum wage standard).';
    } else if (wageUnit === 'week' && Number(wage) < 2400) {
      errs.wage = 'Weekly pay must be at least ₹2,400/week.';
    } else if (wageUnit === 'month' && Number(wage) < 12000) {
      errs.wage = 'Monthly salary must be at least ₹12,000/month.';
    } else if (wageUnit === 'total' && Number(wage) < 400) {
      errs.wage = 'Project total must be at least ₹400.';
    }

    if (!Number.isInteger(workersCount) || workersCount < 1 || workersCount > 50) {
      errs.workersCount = 'Workers needed must be between 1 and 50.';
    }

    if (!duration.trim() || duration.trim().length < 2 || duration.trim().length > 80) {
      errs.duration = 'Enter a duration between 2 and 80 characters.';
    }

    if (['weekly', 'monthly', 'long_term'].includes(employmentType) && (!workSchedule.trim() || workSchedule.trim().length < 5 || workSchedule.trim().length > 120)) {
      errs.workSchedule = 'Enter a clear schedule between 5 and 120 characters.';
    }

    if (!payment.trim() || !['Same day via UPI or Cash (Recommended)', 'Weekly settlement every Saturday', 'Monthly bank transfer / UPI on 1st of every month', '30% advance, balance on milestone handover', 'Immediately at job completion', 'Monthly payroll with attendance register & festive bonus'].includes(payment)) {
      errs.payment = 'Choose a valid payment mode and timing.';
    }

    if (!trades.includes(trade)) errs.trade = 'Choose a valid trade.';
    if (!['Today', 'Tomorrow', 'This week', 'Next week', '1st of next month'].includes(date)) errs.date = 'Choose when the work is needed.';
    if (!['Mumbai', 'Navi Mumbai'].includes(selectedCity)) errs.city = 'Choose a valid city.';
    if (!locations.some(location => location.city === selectedCity && location.neighborhood === selectedNeighborhood)) {
      errs.neighborhood = 'Choose a locality within the selected city.';
    }
    if (!['daily', 'contract', 'weekly', 'monthly', 'long_term'].includes(employmentType)) errs.employmentType = 'Choose a valid employment type.';
    if (!['day', 'week', 'month', 'total'].includes(wageUnit)) errs.wageUnit = 'Choose a valid wage unit.';
    const expectedUnit: Record<EmploymentType, WageUnit> = { daily: 'day', contract: 'total', weekly: 'week', monthly: 'month', long_term: 'month' };
    if (expectedUnit[employmentType] !== wageUnit) errs.wageUnit = 'Choose the pay unit that matches the employment type.';
    if (compatibleTrades.some(compatibleTrade => !trades.includes(compatibleTrade) || compatibleTrade === trade)) {
      errs.compatibleTrades = 'Remove invalid or duplicate compatible trades.';
    }
    if (tools.trim().length > 250) errs.tools = 'Tools and materials details must be 250 characters or fewer.';
    if (safetyGear.trim().length > 250) errs.safetyGear = 'Safety details must be 250 characters or fewer.';

    // Daily shift hour limit: 09:00 AM to 07:00 PM (Requirement 5)
    if (employmentType === 'daily' || employmentType === 'contract') {
      if (startTime < '09:00' || startTime > '19:00') {
        errs.hours = 'Start time must be within standard daily shift hours (09:00 AM to 07:00 PM).';
      } else if (endTime < '09:00' || endTime > '19:00') {
        errs.hours = 'End time must not exceed 07:00 PM (19:00). Daily shift limit is 9 AM – 7 PM.';
      } else if (endTime <= startTime) {
        errs.hours = 'End time must be later than start time.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please correct the highlighted errors before publishing.', 'warning');
      return;
    }

    const fullArea = `${selectedNeighborhood}, ${selectedCity}`;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      trade,
      compatibleTrades: compatibleTrades.length > 0 ? compatibleTrades : undefined,
      employmentType,
      wageUnit,
      employerId: currentEmployer.id,
      employer: `${currentEmployer.name} · ${currentEmployer.company || currentEmployer.name}`,
      employerPhone: currentEmployer.phone,
      verified: true,
      description: description.trim(),
      area: fullArea,
      city: selectedCity,
      neighborhood: selectedNeighborhood,
      siteAddress: siteAddress.trim(),
      distance: '1.2 km',
      wage: Number(wage),
      hours: ['daily', 'contract'].includes(employmentType) ? `${startTime} – ${endTime}` : workSchedule.trim(),
      duration,
      payment,
      tools: tools.trim() || 'To be agreed prior to commencement',
      safetyGear: safetyGear.trim(),
      date,
      workersNeeded: workersCount,
      status: 'open',
      paymentStatus: 'pending',
      interested: 0,
      createdAt: 'Just now'
    };

    setJobs([newJob, ...jobs]);
    setPostedSuccess(true);
    addToast('Job posted live on the Digital Naka!', 'success');
  };

  if (postedSuccess) {
    return (
      <div className="post-success-view">
        <div className="success-dialog-card">
          <div className="success-badge-icon">
            <CheckCircle2 size={42} />
          </div>
          <div className="eyebrow-chip">LISTING IS NOW LIVE</div>
          <h2 className="success-title">Your job was posted successfully!</h2>
          <p className="success-desc">
            Local {trade.toLowerCase()}s in {selectedNeighborhood}, {selectedCity} can now see this {getEmploymentTypeLabel(employmentType).toLowerCase()} listing and apply with transparent terms.
          </p>

          <div className="success-actions-wrap">
            <Link to="/employer/jobs" className="btn-primary-large">
              Manage this job <ArrowRight size={16} />
            </Link>
            <Link to="/worker/jobs" className="btn-soft-large">
              View on worker feed <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employer-post-page">
      {/* Back button */}
      <div className="post-top-nav">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/employer')}
        >
          <ArrowLeft size={16} />
          <span>Back to overview</span>
        </button>
      </div>

      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> TRANSPARENT TERMS
          </div>
          <h1 className="page-main-title">Post a Work Opportunity</h1>
          <p className="page-main-subtitle">
            Post daily wage work or long-term employment. Standard fair rates and humane shift hours (9 AM – 7 PM) attract verified Urban Company-grade workers.
          </p>
        </div>
      </div>

      <div className="post-form-layout-grid">
        {/* Left: The Form */}
        <div className="post-form-col">
          <form onSubmit={handleSubmit} className="job-creation-form" noValidate>
            {/* Section 01: Work Scope & Trade */}
            <div className="form-section-header">
              <span className="step-num">01</span>
              <div>
                <h3 className="section-heading">Work Scope & Trade</h3>
                <small className="section-subtext">What trade and tasks are needed?</small>
              </div>
            </div>

            <div className="fields-grid-2col">
              <label className="field-block full-width">
                <span className="field-label">Job Title *</span>
                <input
                  type="text"
                  className={`text-input ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. Master Bedroom Inverter & Switchboard Rewiring"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  required
                  maxLength={100}
                />
                {errors.title && <span className="field-error-msg">{errors.title}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Required Trade *</span>
                <select
                  className="select-input"
                  value={trade}
                  aria-invalid={Boolean(errors.trade)}
                  onChange={e => {
                    const newTrade = e.target.value;
                    setTrade(newTrade);
                    if (errors.trade) setErrors(prev => ({ ...prev, trade: '' }));
                    const bench = STANDARD_TRADE_RATES[newTrade];
                    if (bench && employmentType === 'daily') {
                      setWage(bench.daily);
                    }
                  }}
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
                <span className="field-label">When is work needed?</span>
                <select
                  className="select-input"
                  value={date}
                  aria-invalid={Boolean(errors.date)}
                  onChange={e => {
                    setDate(e.target.value);
                    if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                  }}
                >
                  <option value="Today">Today (Urgent)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This week">This week</option>
                  <option value="Next week">Next week</option>
                  <option value="1st of next month">1st of next month</option>
                </select>
                {errors.date && <span className="field-error-msg">{errors.date}</span>}
              </label>

              {/* Compatible Trades (Requirement 5) */}
              <div className="field-block full-width">
                <span className="field-label">Compatible Trades / Secondary Skills (Optional)</span>
                <p className="field-helper-text">
                  Select other trades whose workers are eligible for this job:
                </p>
                <div className="compatible-trades-chips">
                  {trades.filter(t => t !== trade).map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`trade-toggle-chip ${compatibleTrades.includes(t) ? 'selected' : ''}`}
                      onClick={() => {
                        toggleCompatibleTrade(t);
                        if (errors.compatibleTrades) setErrors(prev => ({ ...prev, compatibleTrades: '' }));
                      }}
                    >
                      {compatibleTrades.includes(t) ? '✓ ' : '+ '}{t}
                    </button>
                  ))}
                </div>
                {errors.compatibleTrades && <span className="field-error-msg">{errors.compatibleTrades}</span>}
              </div>

              <label className="field-block full-width">
                <span className="field-label">Detailed Work Description *</span>
                <textarea
                  className={`textarea-input ${errors.description ? 'is-invalid' : ''}`}
                  rows={3}
                  placeholder="Describe the exact requirements, responsibilities, tools on site, and supervisor contact..."
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  required
                  maxLength={2000}
                />
                {errors.description && <span className="field-error-msg">{errors.description}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Number of Workers Needed</span>
                <input
                  type="number"
                  className={`text-input ${errors.workersCount ? 'is-invalid' : ''}`}
                  min={1}
                  max={50}
                  value={workersCount}
                  onChange={e => {
                    setWorkersCount(Number(e.target.value));
                    if (errors.workersCount) setErrors(prev => ({ ...prev, workersCount: '' }));
                  }}
                  required
                />
                {errors.workersCount && <span className="field-error-msg">{errors.workersCount}</span>}
              </label>
            </div>

            {/* Section 02: Employment Duration & Schedule (Requirements 5 & 8) */}
            <div className="form-section-header">
              <span className="step-num">02</span>
              <div>
                <h3 className="section-heading">Employment Type & Shift Hours</h3>
                <small className="section-subtext">Choose duration and schedule. Daily shift hours are restricted between 9 AM and 7 PM.</small>
              </div>
            </div>

            <div className="fields-grid-2col">
              <div className="field-block full-width">
                <span className="field-label">Job Duration / Employment Type *</span>
                <div className="emp-type-selector-grid">
                  <button
                    type="button"
                    className={`emp-type-option-card ${employmentType === 'daily' ? 'active' : ''}`}
                    onClick={() => handleEmploymentTypeChange('daily')}
                  >
                    <span className="opt-title">Daily Work</span>
                    <span className="opt-desc">Single or few days naka wage</span>
                  </button>
                  <button
                    type="button"
                    className={`emp-type-option-card ${employmentType === 'contract' ? 'active' : ''}`}
                    onClick={() => handleEmploymentTypeChange('contract')}
                  >
                    <span className="opt-title">Short-Term Contract</span>
                    <span className="opt-desc">Project or milestone basis</span>
                  </button>
                  <button
                    type="button"
                    className={`emp-type-option-card ${employmentType === 'weekly' ? 'active' : ''}`}
                    onClick={() => handleEmploymentTypeChange('weekly')}
                  >
                    <span className="opt-title">Weekly Work</span>
                    <span className="opt-desc">1–4 weeks continuous</span>
                  </button>
                  <button
                    type="button"
                    className={`emp-type-option-card ${employmentType === 'monthly' ? 'active' : ''}`}
                    onClick={() => handleEmploymentTypeChange('monthly')}
                  >
                    <span className="opt-title">Monthly Work</span>
                    <span className="opt-desc">Monthly fixed salary</span>
                  </button>
                  <button
                    type="button"
                    className={`emp-type-option-card ${employmentType === 'long_term' ? 'active' : ''}`}
                    onClick={() => handleEmploymentTypeChange('long_term')}
                  >
                    <span className="opt-title">Long-Term / Ongoing</span>
                    <span className="opt-desc">Permanent full-time role</span>
                  </button>
                </div>
              </div>

              <label className="field-block">
                <span className="field-label">Expected Duration Description</span>
                <input
                  type="text"
                  className={`text-input ${errors.duration ? 'is-invalid' : ''}`}
                  placeholder="e.g. 1 day, 6 months, Ongoing"
                  value={duration}
                  onChange={e => {
                    setDuration(e.target.value);
                    if (errors.duration) setErrors(prev => ({ ...prev, duration: '' }));
                  }}
                  required
                  maxLength={80}
                />
                {errors.duration && <span className="field-error-msg">{errors.duration}</span>}
              </label>

              {['weekly', 'monthly', 'long_term'].includes(employmentType) ? (
                <label className="field-block">
                  <span className="field-label">Work Schedule & Shift</span>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="e.g. Monday – Saturday, 9:00 AM – 6:00 PM"
                    value={workSchedule}
                    onChange={e => {
                      setWorkSchedule(e.target.value);
                      if (errors.workSchedule) setErrors(prev => ({ ...prev, workSchedule: '' }));
                    }}
                    required
                    maxLength={120}
                    aria-invalid={Boolean(errors.workSchedule)}
                  />
                  {errors.workSchedule && <span className="field-error-msg">{errors.workSchedule}</span>}
                </label>
              ) : (
                <div className="field-block">
                  <span className="field-label">Daily Shift Hours (Limit: 9:00 AM – 7:00 PM) *</span>
                  <div className="time-range-row">
                    <input
                      type="time"
                      className={`text-input ${errors.hours ? 'is-invalid' : ''}`}
                      min="09:00"
                      max="18:30"
                      value={startTime}
                      onChange={e => {
                        setStartTime(e.target.value);
                        if (errors.hours) setErrors(prev => ({ ...prev, hours: '' }));
                      }}
                      required
                    />
                    <span>to</span>
                    <input
                      type="time"
                      className={`text-input ${errors.hours ? 'is-invalid' : ''}`}
                      min="09:30"
                      max="19:00"
                      value={endTime}
                      onChange={e => {
                        setEndTime(e.target.value);
                        if (errors.hours) setErrors(prev => ({ ...prev, hours: '' }));
                      }}
                      required
                    />
                  </div>
                  <span className="field-helper-text">
                    ⏱️ Daily shifts must stay between 09:00 AM and 07:00 PM to comply with fair labor guidelines.
                  </span>
                  {errors.hours && <span className="field-error-msg">{errors.hours}</span>}
                </div>
              )}
            </div>

            {/* Section 03: Wages & Location */}
            <div className="form-section-header">
              <span className="step-num">03</span>
              <div>
                <h3 className="section-heading">Wages & Location</h3>
                <small className="section-subtext">Clear terms prevent disputes on site.</small>
              </div>
            </div>

            <div className="fields-grid-2col">
              <label className="field-block">
                <span className="field-label">City *</span>
                <select
                  className="select-input"
                  value={selectedCity}
                  aria-invalid={Boolean(errors.city)}
                  onChange={e => {
                    const newCity = e.target.value as 'Mumbai' | 'Navi Mumbai';
                    setSelectedCity(newCity);
                    const firstNeigh = locations.find(l => l.city === newCity);
                    if (firstNeigh) setSelectedNeighborhood(firstNeigh.neighborhood);
                    setErrors(prev => ({ ...prev, city: '', neighborhood: '' }));
                  }}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                </select>
                {errors.city && <span className="field-error-msg">{errors.city}</span>}
              </label>

              <label className="field-block">
                <span className="field-label">Locality / Neighborhood *</span>
                <select
                  className="select-input"
                  value={selectedNeighborhood}
                  onChange={e => {
                    setSelectedNeighborhood(e.target.value);
                    if (errors.neighborhood) setErrors(prev => ({ ...prev, neighborhood: '' }));
                  }}
                  aria-invalid={Boolean(errors.neighborhood)}
                >
                  {cityNeighborhoods.map(l => (
                    <option key={`${l.city}-${l.neighborhood}`} value={l.neighborhood}>
                      {l.neighborhood}
                    </option>
                  ))}
                </select>
                {errors.neighborhood && <span className="field-error-msg">{errors.neighborhood}</span>}
              </label>

              <label className="field-block full-width">
                <span className="field-label">Exact Site Address *</span>
                <input
                  type="text"
                  className={`text-input ${errors.siteAddress ? 'is-invalid' : ''}`}
                  placeholder="Plot / Flat number, Street name, Landmark"
                  value={siteAddress}
                  onChange={e => {
                    setSiteAddress(e.target.value);
                    if (errors.siteAddress) setErrors(prev => ({ ...prev, siteAddress: '' }));
                  }}
                  required
                />
                {errors.siteAddress && <span className="field-error-msg">{errors.siteAddress}</span>}
              </label>

              <div className="field-block">
                <span className="field-label">Wage Amount (₹) *</span>
                <input
                  type="number"
                  className={`text-input ${errors.wage ? 'is-invalid' : ''}`}
                  placeholder={wageUnit === 'month' ? '24000' : '850'}
                  min={300}
                  max={100000000}
                  step={50}
                  value={wage}
                  onChange={e => {
                    setWage(e.target.value === '' ? '' : Number(e.target.value));
                    if (errors.wage) setErrors(prev => ({ ...prev, wage: '' }));
                  }}
                  required
                />
                {/* Urban Company Benchmark Rate helper pill */}
                <div className="uc-rate-helper-tag">
                  <Award size={13} />
                  <span>UC Market Benchmark for {trade}: <strong>{standardRate.label}</strong></span>
                </div>
                {errors.wage && <span className="field-error-msg">{errors.wage}</span>}
              </div>

              <label className="field-block">
                <span className="field-label">Pay Frequency / Unit *</span>
                <select
                  className="select-input"
                  value={wageUnit}
                  onChange={e => {
                    setWageUnit(e.target.value as WageUnit);
                    if (errors.wageUnit) setErrors(prev => ({ ...prev, wageUnit: '' }));
                  }}
                  aria-invalid={Boolean(errors.wageUnit)}
                >
                  <option value="day">per Day (₹/day)</option>
                  <option value="week">per Week (₹/week)</option>
                  <option value="month">per Month (₹/month)</option>
                  <option value="total">Project Total (₹/contract)</option>
                </select>
                {errors.wageUnit && <span className="field-error-msg">{errors.wageUnit}</span>}
              </label>

              <label className="field-block full-width">
                <span className="field-label">Payment Mode & Timing</span>
                <select
                  className="select-input"
                  value={payment}
                  onChange={e => {
                    setPayment(e.target.value);
                    if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }));
                  }}
                  aria-invalid={Boolean(errors.payment)}
                >
                  <option value="Same day via UPI or Cash (Recommended)">Same day via UPI or Cash (Recommended)</option>
                  <option value="Weekly settlement every Saturday">Weekly settlement every Saturday</option>
                  <option value="Monthly bank transfer / UPI on 1st of every month">Monthly bank transfer / UPI on 1st of every month</option>
                  <option value="30% advance, balance on milestone handover">30% advance, balance on milestone handover</option>
                  <option value="Immediately at job completion">Immediately at job completion</option>
                  <option value="Monthly payroll with attendance register & festive bonus">Monthly payroll with attendance register & festive bonus</option>
                </select>
                {errors.payment && <span className="field-error-msg">{errors.payment}</span>}
              </label>

              <label className="field-block full-width">
                <span className="field-label">Tools & Materials Responsibility</span>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. Bring personal hand tools; heavy tools & materials provided on site"
                  value={tools}
                  onChange={e => {
                    setTools(e.target.value);
                    if (errors.tools) setErrors(prev => ({ ...prev, tools: '' }));
                  }}
                  maxLength={250}
                />
                {errors.tools && <span className="field-error-msg">{errors.tools}</span>}
              </label>

              <label className="field-block full-width">
                <span className="field-label">Safety Requirements</span>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. Rubber boots required; safety harness supplied on site"
                  value={safetyGear}
                  onChange={e => {
                    setSafetyGear(e.target.value);
                    if (errors.safetyGear) setErrors(prev => ({ ...prev, safetyGear: '' }));
                  }}
                  maxLength={250}
                />
                {errors.safetyGear && <span className="field-error-msg">{errors.safetyGear}</span>}
              </label>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="form-error-banner">
                <AlertCircle size={16} />
                <span>Please fix the errors above before publishing your listing.</span>
              </div>
            )}

            <div className="form-submit-row">
              <button type="submit" className="btn-primary-large">
                <Plus size={18} /> Publish {getEmploymentTypeLabel(employmentType)} Listing
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Sticky Card (Redesigned - No collision or overlap!) */}
        <aside className="post-preview-col">
          <div className="preview-sticky-card">
            <div className="preview-label-tag">
              <Eye size={14} /> LIVE WORKER PREVIEW
            </div>
            <p className="preview-caption">
              This is how your listing appears in the worker feed in real time.
            </p>

            <div className="preview-job-card-box">
              {/* Clean Top Bar: Badges on left, Wage on right */}
              <div className="preview-card-top-bar">
                <div className="preview-top-tags">
                  <span className="pill-trade">{trade}</span>
                  <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(employmentType)}`}>
                    {getEmploymentTypeLabel(employmentType)}
                  </span>
                  <span className="pill-date pill-urgent">{date}</span>
                </div>
                <div className="preview-wage-box">
                  <strong className="preview-wage-val">₹{wage ? Number(wage).toLocaleString('en-IN') : '0'}</strong>
                  <span className="preview-wage-unit">/{wageUnit}</span>
                </div>
              </div>

              {/* Title & Employer Row */}
              <div className="preview-card-title-row">
                <div className="trade-avatar" data-trade={trade.toLowerCase()}>
                  {getTradeIcon(trade)}
                </div>
                <div className="preview-title-col">
                  <h4 className="preview-job-title">{title || 'Untitled Work Opportunity'}</h4>
                  <div className="preview-employer-line">
                    <span>{currentEmployer.name} · {currentEmployer.company || currentEmployer.name}</span>
                    <span className="pill-verified-inline" title="Identity Verified Employer">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta details */}
              <div className="preview-meta-row">
                <div className="p-meta-item">
                  <MapPin size={13} /> {selectedNeighborhood}, {selectedCity}
                </div>
                <div className="p-meta-item">
                  <Clock3 size={13} />{' '}
                  {employmentType === 'monthly' || employmentType === 'long_term'
                    ? workSchedule
                    : `${startTime} – ${endTime} · ${duration}`}
                </div>
                <div className="p-meta-item">
                  <Users size={13} /> {workersCount} worker{workersCount > 1 ? 's' : ''} needed
                </div>
              </div>

              {compatibleTrades.length > 0 && (
                <div className="preview-compatible-strip">
                  <small>Also compatible with: {compatibleTrades.join(', ')}</small>
                </div>
              )}

              <div className="preview-terms-pill-strip">
                <span className="terms-pill-item">Payment: {payment}</span>
                <span className="terms-pill-item">Tools: {tools}</span>
              </div>
            </div>

            {/* Urban Company-style Fair Terms & Trust Pledge */}
            <div className="fair-terms-notice-card">
              <ShieldCheck size={18} className="notice-icon" />
              <div className="notice-text">
                <strong>WorkForces Trust Pledge:</strong> Clear wages, reasonable 9 AM – 7 PM daily hours, and upfront tool agreements ensure dignified work and 0% disputes.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
