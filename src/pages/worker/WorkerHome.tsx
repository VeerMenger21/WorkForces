import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context';
import { JobCard } from '../../components/JobCard';
import { isWorkerMatchingJob } from '../../utils/matching';
import { MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Clock, BriefcaseBusiness, Bookmark, Radio, Flame, Search } from 'lucide-react';

export function WorkerHome() {
  const { worker, setWorker, jobs, savedJobIds, addToast } = useStore();
  const [filter, setFilter] = useState<'Today' | 'Tomorrow' | 'This week' | 'All'>('Today');

  const toggleAvailability = () => {
    const nextStatus = !worker.available;
    setWorker({ ...worker, available: nextStatus });
    if (nextStatus) {
      addToast('You are now marked Available Today! Nearby employers can find you.', 'success');
    } else {
      addToast('Marked as unavailable. You will not receive new calls today.', 'info');
    }
  };

  const matchingTradeJobs = jobs.filter(
    j => j.status === 'open' && isWorkerMatchingJob(worker, j)
  );

  const filteredJobs = matchingTradeJobs.filter(j => {
    if (filter === 'Today') return j.date === 'Today';
    if (filter === 'Tomorrow') return j.date === 'Tomorrow';
    if (filter === 'This week') return true;
    return true;
  });

  const confirmedJobs = jobs.filter(j => j.status === 'confirmed' && j.workerId === worker.id);

  return (
    <div className="worker-home-page">
      {/* Welcome Top Banner */}
      <section className="worker-welcome-section">
        <div className="welcome-text-col">
          <div className="eyebrow-chip">
            <span className="live-pulse" />
            <span>MUMBAI · ANDHERI EAST NAKA</span>
          </div>
          <h1 className="welcome-heading">
            {"Good morning"}, {worker.name.split(' ')[0]}
          </h1>
          <p className="welcome-subtext">
            <MapPin size={14} className="subtext-icon" />
            <span>Based around {worker.area}</span>
          </p>
        </div>

        <Link to="/worker/profile" className="welcome-avatar-link">
          <div className="avatar-circle">
            <span>{worker.photo}</span>
          </div>
        </Link>
      </section>

      {/* Hero Availability & Naka Status Card */}
      <section className={`hero-naka-card ${worker.available ? 'is-available-active' : ''}`}>
        <div className="naka-card-content">
          <div className="naka-card-header">
            <div className="naka-badge">
              <Radio size={14} className={worker.available ? 'icon-pulse' : ''} />
              <span>{"DIGITAL NAKA · PROTOTYPE"}</span>
            </div>
            <div className="naka-time-hint">
              <Clock size={13} />
              <span>Peak hiring: 8 AM – 11 AM</span>
            </div>
          </div>

          <div className="naka-card-body">
            <div className="naka-text-side">
              <h2 className="naka-title">
                {worker.available
                  ? "You are active at the Digital Naka."
                  : "Ready for work today? Mark yourself available."}
              </h2>
              <p className="naka-description">
                {worker.available
                  ? "Nearby contractors and property managers can see your profile and reach out directly with clear terms."
                  : "Turn on your availability to let employers searching in Andheri East and Saki Naka find your profile."}
              </p>
            </div>

            <div className="availability-toggle-box">
              <button
                type="button"
                onClick={toggleAvailability}
                className={`availability-toggle-btn ${worker.available ? 'btn-active' : 'btn-idle'}`}
                aria-pressed={worker.available}
              >
                <div className="toggle-switch-track">
                  <div className="toggle-switch-thumb" />
                </div>
                <span className="toggle-btn-label">
                  {worker.available
                    ? "Available Today"
                    : "Mark Available Today"}
                </span>
              </button>
            </div>
          </div>

          <div className="naka-card-footer-strip">
            <div className="footer-spec">
              <span className="spec-label">YOUR TRADE</span>
              <span className="spec-val">
                {worker.trade} · {worker.experience}
              </span>
            </div>
            <div className="footer-spec">
              <span className="spec-label">EXPECTED RATE</span>
              <span className="spec-val">₹{worker.dailyRate || 850} / day</span>
            </div>
            <div className="footer-spec">
              <span className="spec-label">CURRENT STATUS</span>
              <span className={`status-pill ${worker.available ? 'pill-online' : 'pill-offline'}`}>
                <span className="dot" />
                {worker.available ? 'Open for Calls' : 'Not Active'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="worker-metrics-grid">
        <div className="worker-metric-box">
          <div className="metric-box-top">
            <span className="metric-label">Open {worker.trade} Jobs</span>
            <div className="metric-icon-wrap icon-green">
              <BriefcaseBusiness size={18} />
            </div>
          </div>
          <div className="metric-box-value">{matchingTradeJobs.length}</div>
          <div className="metric-box-hint">
            <span className="hint-strong">Nearby</span> within 5 km
          </div>
        </div>

        <div className="worker-metric-box">
          <div className="metric-box-top">
            <span className="metric-label">Agreed Bookings</span>
            <div className="metric-icon-wrap icon-amber">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="metric-box-value">{confirmedJobs.length}</div>
          <div className="metric-box-hint">
            <Link to="/worker/diary" className="hint-link">
              View in diary <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="worker-metric-box">
          <div className="metric-box-top">
            <span className="metric-label">Saved Listings</span>
            <div className="metric-icon-wrap icon-teal">
              <Bookmark size={18} />
            </div>
          </div>
          <div className="metric-box-value">{savedJobIds.length}</div>
          <div className="metric-box-hint">Bookmarked for later</div>
        </div>
      </section>

      {/* Nearby Jobs Section */}
      <section className="worker-jobs-section">
        <div className="section-header-row">
          <div>
            <div className="eyebrow-chip">
              <Sparkles size={12} /> CLEAR TERMS UP FRONT
            </div>
            <h2 className="section-title">{"Nearby Jobs"}</h2>
          </div>
          <Link to="/worker/jobs" className="see-all-link">
            <span>{"Browse all work"}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="filter-pill-bar">
          {(['Today', 'Tomorrow', 'This week', 'All'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              className={`pill-btn ${filter === tab ? 'is-active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'Today' && <Flame size={13} className="tab-icon" />}
              <span>
                {tab === 'Today'
                  ? "Today"
                  : tab === 'This week'
                  ? "This week"
                  : tab === 'All'
                  ? "All Jobs"
                  : tab}
              </span>
            </button>
          ))}
        </div>

        {/* Job List */}
        {filteredJobs.length > 0 ? (
          <div className="job-cards-stack">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <div className="empty-icon-box">
              <Search size={24} />
            </div>
            <h4 className="empty-title">
              No {worker.trade.toLowerCase()} jobs found for '{filter}'.
            </h4>
            <p className="empty-desc">
              New daily jobs are posted each morning by contractors around Andheri and Saki Naka.
            </p>
            <Link to="/worker/jobs" className="btn-primary-small">
              Browse all available trades <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* Bottom Safety & Dignity Assurance Card */}
      <footer className="worker-guarantee-strip">
        <ShieldCheck size={20} className="guarantee-icon" />
        <div className="guarantee-text">
          <strong>Fair terms guarantee:</strong> Always confirm wage, working hours, and whether
          materials/tools are provided before heading to any work site.
        </div>
        <Link to="/worker/rights" className="guarantee-link">
          Know your rights <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
