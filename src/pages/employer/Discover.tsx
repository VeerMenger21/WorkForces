import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context';
import { Worker } from '../../types';
import { locations, trades } from '../../seedData';
import { useLanguage } from '../../i18n';
import {
  workerAboutForLanguage,
  workerAreaForLanguage,
  workerExperienceForLanguage,
  workerNameForLanguage,
  workerSkillForLanguage,
  workerTradeForLanguage,
  workerWorkExperienceForLanguage
} from '../../utils/workerLocalization';
import { Search, MapPin, Star, CheckCircle2, Phone, X, BriefcaseBusiness, ShieldCheck, Plus, ArrowRight, Sparkles, Radio, Filter, Award } from 'lucide-react';

export function Discover() {
  const { workers, jobs, setJobs, addToast, getRatingSummary, getRatingsForRecipient, currentEmployer } = useStore();
  const { language } = useLanguage();

  const [query, setQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All trades');
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All neighborhoods');
  const [activeModalWorker, setActiveModalWorker] = useState<Worker | null>(null);
  const [selectedJobToHire, setSelectedJobToHire] = useState<string>('');

  useEffect(() => {
    if (!activeModalWorker) return;
    const currentWorker = workers.find(w => w.id === activeModalWorker.id);
    if (!currentWorker?.available) setActiveModalWorker(null);
  }, [activeModalWorker, workers]);

  const openJobs = jobs.filter(j => j.status === 'open' && j.employerId === currentEmployer.id);

  // Derive available neighborhoods based on selected city
  const availableNeighborhoods = useMemo(() => {
    if (selectedCity === 'All cities') return locations;
    return locations.filter(l => l.city === selectedCity);
  }, [selectedCity]);

  // Filter workers based on search, trade, city, neighborhood, and availability
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      // REQUIREMENT: If the worker is not available today then employer should not see that worker in the list at all!
      if (!w.available) return false;

      // Filter by Trade
      if (selectedTrade !== 'All trades') {
        const normSelected = selectedTrade.toLowerCase();
        const normWorkerTrade = w.trade.toLowerCase();
        const matchesTrade = normWorkerTrade === normSelected ||
          w.skills?.some(s => s.toLowerCase().includes(normSelected)) ||
          normSelected.includes(normWorkerTrade);
        if (!matchesTrade) return false;
      }

      // Filter by City
      if (selectedCity !== 'All cities') {
        if (w.city && w.city !== selectedCity) return false;
      }

      // Filter by Neighborhood
      if (selectedNeighborhood !== 'All neighborhoods') {
        if (w.neighborhood) {
          if (w.neighborhood !== selectedNeighborhood) return false;
        } else if (!w.area.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
          return false;
        }
      }

      // Text search
      if (query.trim()) {
        const localizedText = [
          workerNameForLanguage(w.name, language), workerTradeForLanguage(w.trade, language),
          workerAreaForLanguage(w.area, language), workerWorkExperienceForLanguage(w, language),
          workerAboutForLanguage(w, language), ...(w.skills || []).map(skill => workerSkillForLanguage(skill, language))
        ].join(' ');
        const text = `${w.name} ${w.trade} ${w.area} ${w.workExperience || ''} ${w.sample || ''} ${w.aboutMe || ''} ${w.intro || ''} ${w.skills?.join(' ') || ''} ${localizedText}`.toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }

      return true;
    });
  }, [workers, selectedTrade, selectedCity, selectedNeighborhood, query, language]);

  const handleHireForJob = (worker: Worker) => {
    const currentWorker = workers.find(w => w.id === worker.id);
    if (!currentWorker?.available) {
      addToast(`${worker.name} is currently unavailable and cannot be assigned.`, 'warning');
      setActiveModalWorker(null);
      return;
    }

    if (!openJobs.length) {
      addToast('No open jobs available to assign. Please post a job first!', 'warning');
      return;
    }

    const targetJobId = selectedJobToHire || openJobs[0].id;
    const targetJob = openJobs.find(j => j.id === targetJobId) || openJobs[0];

    setJobs(prev =>
      prev.map(j =>
        j.id === targetJob.id && j.employerId === currentEmployer.id && j.status === 'open'
          ? {
              ...j,
              status: 'confirmed',
              workerId: worker.id,
              paymentStatus: 'pending'
            }
          : j
      )
    );

    addToast(`Offer confirmed! ${worker.name} assigned to "${targetJob.title}". Synced with worker diary.`, 'success');
    setActiveModalWorker(null);
  };

  // Helper when modal opens to check ratings
  const modalRatings = activeModalWorker ? getRatingsForRecipient(activeModalWorker.id) : [];
  const modalRatingSummary = activeModalWorker ? getRatingSummary(activeModalWorker.id) : null;

  return (
    <div className="employer-discover-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> DIGITAL NAKA DIRECTORY
          </div>
          <h1 className="page-main-title">Find Skilled Local Workers</h1>
          <p className="page-main-subtitle">
            Browse verified trade workers across 24 localities in Mumbai & Navi Mumbai. Filter by trade, location, and verified experience.
          </p>
        </div>

        <Link to="/employer/post-job" className="btn-primary-small">
          <Plus size={16} /> Have a project? "Post a job"
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="discover-filters-container">
        <div className="search-field-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search worker by name, trade, or skill (e.g. wiring, painter, tile fitting)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="clear-query-btn"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-controls-group">
          {/* Trade Filter */}
          <select
            value={selectedTrade}
            onChange={e => setSelectedTrade(e.target.value)}
            className="filter-select"
            aria-label="Filter by trade"
          >
            <option value="All trades">All Trades ({trades.length})</option>
            {trades.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={e => {
              setSelectedCity(e.target.value);
              setSelectedNeighborhood('All neighborhoods');
            }}
            className="filter-select"
            aria-label="Filter by city"
          >
            <option value="All cities">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Navi Mumbai">Navi Mumbai</option>
          </select>

          {/* Neighborhood Filter */}
          <select
            value={selectedNeighborhood}
            onChange={e => setSelectedNeighborhood(e.target.value)}
            className="filter-select"
            aria-label="Filter by neighborhood"
          >
            <option value="All neighborhoods">All Localities ({availableNeighborhoods.length})</option>
            {availableNeighborhoods.map(loc => (
              <option key={`${loc.city}-${loc.neighborhood}`} value={loc.neighborhood}>
                {loc.neighborhood} ({loc.city})
              </option>
            ))}
          </select>

          {/* Availability Indicator (Strictly Available Only) */}
          <div className="filter-badge-verified-today" title="Only available workers are displayed">
            <Radio size={13} className="icon-pulse" />
            <span>Available Today Only ({filteredWorkers.length})</span>
          </div>
        </div>

        {/* Quick filter by posted jobs if employer has open jobs */}
        {openJobs.length > 0 && (
          <div className="filter-job-match-strip">
            <span className="strip-label">
              <Filter size={13} /> Filter for your posted jobs:
            </span>
            <div className="strip-pills">
              {openJobs.map(job => (
                <button
                  key={job.id}
                  type="button"
                  className={`strip-job-btn ${selectedTrade === job.trade ? 'active' : ''}`}
                  onClick={() => setSelectedTrade(job.trade)}
                >
                  {job.trade} for "{job.title.substring(0, 24)}..."
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="results-count-bar">
        <span>
          {language === 'hi' ? 'दिखाए जा रहे हैं ' : 'Showing '}
          <strong>{filteredWorkers.length}</strong>
          {language === 'hi'
            ? ' उपलब्ध कुशल कामगार'
            : ` available skilled tradesperson${filteredWorkers.length === 1 ? '' : 's'}`}
        </span>
        {(query || selectedTrade !== 'All trades' || selectedCity !== 'All cities' || selectedNeighborhood !== 'All neighborhoods') && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedTrade('All trades');
              setSelectedCity('All cities');
              setSelectedNeighborhood('All neighborhoods');
            }}
            className="reset-filter-btn"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Worker Cards Grid */}
      {filteredWorkers.length > 0 ? (
        <div className="worker-cards-grid">
          {filteredWorkers.map(w => {
            const ratingSummary = getRatingSummary(w.id);
            const displayRating = ratingSummary.count > 0 ? ratingSummary.rating : (w.rating || 4.8);
            const reviewCount = ratingSummary.count > 0 ? ratingSummary.count : (w.completedJobs || 24);
            const isSuperPro = displayRating >= 4.8 && reviewCount >= 30;
            const displayName = workerNameForLanguage(w.name, language);
            const displayTrade = workerTradeForLanguage(w.trade, language);
            const displayExperience = workerExperienceForLanguage(w.experience, language);
            const displayArea = workerAreaForLanguage(w.area, language);

            return (
              <article key={w.id} className="worker-directory-card">
                <div className="card-top-strip">
                  <div className="worker-card-avatar">{w.photo}</div>
                  <div className="worker-top-badges">
                    <span className="status-pill-small pill-online">
                      <span className="dot" />
                      {"Available Today"}
                    </span>
                    {isSuperPro && (
                      <span className="pill-super-pro" title="Top Rated Verified Pro">
                        <Award size={12} /> {"Super Pro"}
                      </span>
                    )}
                    {w.verified && (
                      <span className="pill-verified" title="Identity Verified">
                        <ShieldCheck size={13} /> {"Verified"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="worker-card-body">
                  <span className="trade-pill-detail">{displayTrade}</span>
                  <h3 className="worker-card-name">{displayName}</h3>
                  <p className="worker-card-exp">
                    <strong>{displayExperience}</strong> {language === 'hi' ? 'का व्यावहारिक काम का अनुभव' : 'practical site experience'}
                  </p>
                  <p className="worker-card-area">
                    <MapPin size={13} /> {displayArea}
                  </p>

                  {/* Renamed to Work Experience (Requirement 6) */}
                  <div className="worker-skills-preview">
                    <span className="skills-sub">Work Experience:</span>
                    <p className="skills-text">{workerWorkExperienceForLanguage(w, language)}</p>
                  </div>

                  {/* Additional skills tags */}
                  {w.skills && w.skills.length > 0 && (
                    <div className="worker-tags-preview">
                      {w.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="micro-skill-tag">
                          {workerSkillForLanguage(skill, language)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="worker-rate-bar">
                    <span className="rate-label">Standard Day Rate:</span>
                    <strong className="rate-figure">₹{w.dailyRate || 850} / {language === 'hi' ? 'दिन' : 'day'}</strong>
                  </div>
                </div>

                <div className="worker-card-footer">
                  <div className="rating-pill">
                    <Star size={14} fill="#ea7e24" stroke="#ea7e24" />
                    <span>
                      {displayRating} ({reviewCount} {language === 'hi'
                        ? (ratingSummary.count > 0 ? 'समीक्षाएँ' : 'काम')
                        : (ratingSummary.count > 0 ? 'reviews' : 'jobs')})
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-primary-small"
                    onClick={() => {
                      setActiveModalWorker(w);
                      if (openJobs.length) setSelectedJobToHire(openJobs[0].id);
                    }}
                  >
                    {language === 'hi' ? 'प्रोफ़ाइल देखें और काम दें' : 'View Profile & Hire'} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <Search size={28} />
          </div>
          <h3 className="empty-title">No workers matched your filters</h3>
          <p className="empty-desc">
            Try choosing a different locality or selecting 'All Trades'. Only active workers appear here.
          </p>
          <button
            type="button"
            className="btn-primary-small"
            onClick={() => {
              setQuery('');
              setSelectedTrade('All trades');
              setSelectedCity('All cities');
              setSelectedNeighborhood('All neighborhoods');
            }}
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Worker Profile Modal */}
      {activeModalWorker && (
        <div className="modal-backdrop" onClick={() => setActiveModalWorker(null)}>
          <div className="worker-profile-modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActiveModalWorker(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="modal-header-section">
              <div className="modal-avatar-box">{activeModalWorker.photo}</div>
              <div className="modal-header-info">
                <div className="modal-badges-row">
                  <span className="trade-pill-detail">{workerTradeForLanguage(activeModalWorker.trade, language)}</span>
                  <span
                    className={`status-pill-small ${
                      activeModalWorker.available ? 'pill-online' : 'pill-offline'
                    }`}
                  >
                    {language === 'hi'
                      ? (activeModalWorker.available ? 'आज उपलब्ध' : 'अनुपलब्ध')
                      : (activeModalWorker.available ? 'Available Today' : 'Away')}
                  </span>
                  {activeModalWorker.verified && (
                    <span className="pill-verified">
                      <ShieldCheck size={12} /> {language === 'hi' ? 'पहचान सत्यापित' : 'Verified Identity'}
                    </span>
                  )}
                </div>
                <h2 className="modal-worker-title">{workerNameForLanguage(activeModalWorker.name, language)}</h2>
                <p className="modal-worker-sub">
                  {workerExperienceForLanguage(activeModalWorker.experience, language)} {language === 'hi' ? 'का अनुभव' : 'practical experience'} · {workerAreaForLanguage(activeModalWorker.area, language)}
                </p>

                {/* Rating display */}
                <div className="modal-rating-row">
                  <Star size={16} fill="#ea7e24" stroke="#ea7e24" />
                  <strong>
                    {modalRatingSummary && modalRatingSummary.count > 0
                      ? modalRatingSummary.rating
                      : activeModalWorker.rating || 4.8}
                  </strong>
                  <span className="modal-rating-count">
                    ({modalRatingSummary && modalRatingSummary.count > 0
                      ? (language === 'hi' ? `${modalRatingSummary.count} सत्यापित समीक्षाएँ` : `${modalRatingSummary.count} verified reviews`)
                      : (language === 'hi' ? `${activeModalWorker.completedJobs || 24}+ काम पूरे` : `${activeModalWorker.completedJobs || 24}+ completed jobs`)})
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-body-section">
              <div className="modal-spec-row">
                <span className="spec-label">Expected Daily Wage</span>
                <strong className="spec-val-highlight">₹{activeModalWorker.dailyRate || 850} / {language === 'hi' ? 'दिन' : 'day'}</strong>
              </div>

              {/* Work Experience (Requirement 6) */}
              <div className="modal-section-card">
                <h4 className="modal-card-subtitle">
                  <BriefcaseBusiness size={15} /> Work Experience
                </h4>
                <p className="intro-text">
                  {workerWorkExperienceForLanguage(activeModalWorker, language)}
                </p>
                {activeModalWorker.skills && activeModalWorker.skills.length > 0 && (
                  <div className="modal-skills-chips">
                    {activeModalWorker.skills.map((skill, idx) => (
                      <span key={idx} className="skill-chip">
                        {workerSkillForLanguage(skill, language)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* About Me (Requirement 6) */}
              <div className="modal-section-card">
                <h4 className="modal-card-subtitle">
                  <Award size={15} /> About Me
                </h4>
                <p className="intro-text">
                  {workerAboutForLanguage(activeModalWorker, language)}
                </p>
              </div>

              {/* Reviews List */}
              {modalRatings.length > 0 && (
                <div className="modal-section-card">
                  <h4 className="modal-card-subtitle">
                    <Star size={15} /> Recent Client Feedback ({modalRatings.length})
                  </h4>
                  <div className="modal-reviews-list">
                    {modalRatings.map(rev => (
                      <div key={rev.id} className="mini-review-item">
                        <div className="mini-review-top">
                          <span className="mini-reviewer-name">{rev.reviewerName}</span>
                          <span className="mini-review-stars">★ {rev.rating}.0</span>
                        </div>
                        {rev.categories.length > 0 && (
                          <div className="mini-cat-pills">
                            {rev.categories.map((c: string, i: number) => (
                              <span key={i} className="mini-cat-tag">
                                ✓ {c}
                              </span>
                            ))}
                          </div>
                        )}
                        {rev.comment && <p className="mini-review-comment">"{rev.comment}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assign to an open job selector */}
              {openJobs.length > 0 ? (
                <div className="assign-job-select-box">
                  <label className="assign-label">
                    <BriefcaseBusiness size={15} /> Select Open Job to Assign:
                  </label>
                  <select
                    className="select-input"
                    value={selectedJobToHire}
                    onChange={e => setSelectedJobToHire(e.target.value)}
                  >
                    {openJobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} — ₹{job.wage}/{job.wageUnit || 'day'} ({job.area})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="no-open-jobs-note">
              <span>ℹ️ {language === 'hi'
                ? `अभी कोई खुली काम की पोस्ट नहीं है। ${workerNameForLanguage(activeModalWorker.name, language)} को काम देने के लिए पोस्ट करें।`
                : `No open job listings available. Post a job to book ${activeModalWorker.name}.`}</span>
                </div>
              )}
            </div>

            <div className="modal-footer-actions">
              <a
                href={`tel:${activeModalWorker.phone.replace(/\s+/g, '')}`}
                className="btn-outline-large"
              >
                <Phone size={17} /> {language === 'hi' ? 'सीधे कॉल करें' : 'Direct Call'} ({activeModalWorker.phone})
              </a>

              {openJobs.length > 0 ? (
                <button
                  type="button"
                  className="btn-primary-large"
                  onClick={() => handleHireForJob(activeModalWorker)}
                >
                  <CheckCircle2 size={18} /> {language === 'hi' ? 'पुष्टि करें और काम दें' : 'Confirm & Assign Job'}
                </button>
              ) : (
                <Link
                  to="/employer/post-job"
                  className="btn-primary-large"
                  onClick={() => setActiveModalWorker(null)}
                >
                  <Plus size={18} /> {language === 'hi' ? 'काम पोस्ट करें: ' : 'Post a Job for '}{workerNameForLanguage(activeModalWorker.name.split(' ')[0], language)}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
