
import { Link } from 'react-router-dom';
import { useStore } from '../../context';
import { getTradeIcon } from '../../components/JobCard';
import { formatWage, getEmploymentTypeLabel, getEmploymentTypeBadgeClass } from '../../utils/matching';
import { BriefcaseBusiness, Users, CheckCircle2, Plus, MapPin, ArrowRight, Sparkles, IndianRupee, Star, Radio, ShieldAlert, Check } from 'lucide-react';

export function Dashboard() {
  const {jobs, worker, workers, setJobs, currentEmployer, disputes, acknowledgeDispute, resolveDispute, addToast} = useStore();

  const employerJobs = jobs.filter(j => j.employerId === currentEmployer.id);
  const openJobs = employerJobs.filter(j => j.status === 'open');
  const confirmedJobs = employerJobs.filter(j => j.status === 'confirmed');
  const workspaceTypeLabel = currentEmployer.type.replace('_', ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

  const totalInterested = employerJobs.reduce((sum, j) => sum + j.interested, 0);

  const availableWorkers = workers.filter(w => w.available);
  const spotlightWorker = availableWorkers[0];

  // Active disputes targeting this employer
  const activeDisputes = disputes.filter(
    d => (d.employerId === currentEmployer.id || d.employerName.includes(currentEmployer.name)) &&
      d.status !== 'resolved'
  );

  const handleQuickConfirm = (jobId: string) => {
    if (!worker.available) {
      addToast(`${worker.name} is currently unavailable and cannot be assigned.`, 'warning');
      return;
    }

    setJobs(prev =>
      prev.map(j =>
        j.id === jobId && j.employerId === currentEmployer.id && j.status === 'open'
          ? {
              ...j,
              status: 'confirmed',
              workerId: worker.id,
              paymentStatus: 'pending'
            }
          : j
      )
    );
    addToast(`${worker.name} confirmed for this job! Changes synced with Worker diary.`, 'success');
  };

  return (
    <div className="employer-dashboard-page">
      {/* Top Banner */}
      <div className="employer-top-banner">
        <div className="banner-text">
          <div className="eyebrow-chip">
            <Radio size={13} className="icon-pulse" /> MUMBAI METRO WORKSPACE
          </div>
          <h1 className="employer-hero-heading">Welcome back, {currentEmployer.name.split(' ')[0]}.</h1>
          <p className="employer-hero-sub">
            {workspaceTypeLabel} Workspace · {currentEmployer.company || currentEmployer.name} · {currentEmployer.area}
          </p>
        </div>

        <div className="banner-action-wrap">
          <Link to="/employer/post-job" className="btn-primary-large">
            <Plus size={18} /> Post a New Job
          </Link>
        </div>
      </div>

      {/* REQUIREMENT 4: In-App Dispute Alerts Banner */}
      {activeDisputes.length > 0 && (
        <section className="employer-dispute-alert-box">
          <div className="alert-top-row">
            <div className="alert-icon-title">
              <ShieldAlert size={22} className="alert-pulse-icon" />
              <div>
                <strong>Active Payment Dispute Alert ({activeDisputes.length})</strong>
                <p>
                  A worker has reported a payment issue. Please review and acknowledge or settle to maintain trust.
                </p>
              </div>
            </div>
            <span className="demo-disclaimer-pill">In-App Demo Alert</span>
          </div>

          <div className="disputes-list-stack">
            {activeDisputes.map(disp => (
              <div key={disp.id} className="dispute-alert-item">
                <div className="dispute-item-info">
                  <span className="dispute-job-name">{disp.jobTitle}</span>
                  <div className="dispute-meta-line">
                    <strong>Worker: {disp.workerName}</strong>
                    <span className="bullet">·</span>
                    <span>Reason: <em>{disp.reason}</em></span>
                    <span className="bullet">·</span>
                    <span>Amount: <strong>{formatWage(disp.amount, disp.wageUnit)}</strong></span>
                  </div>
                  {disp.description && (
                    <p className="dispute-desc-note">"{disp.description}"</p>
                  )}
                  <small className="dispute-time">{disp.createdAt}</small>
                </div>

                <div className="dispute-actions-group">
                  {disp.status === 'under_review' ? (
                    <button
                      type="button"
                      className="btn-outline-small"
                      onClick={() => acknowledgeDispute(disp.id)}
                    >
                      <Check size={14} /> Acknowledge Dispute
                    </button>
                  ) : (
                    <span className="status-pill-small pill-online">
                      ✓ Acknowledged
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn-primary-small"
                    onClick={() => resolveDispute(disp.id, 'Payment settled by employer.')}
                  >
                    <IndianRupee size={14} /> Settle & Mark Paid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hero Spotlight Card */}
      <section className="employer-naka-hero-card">
        <div className="naka-hero-left">
          <div className="eyebrow-chip gold-chip">
            <Sparkles size={13} /> DIGITAL NAKA · REAL-TIME RADAR
          </div>
          <h2 className="naka-hero-title">
            Skilled hands.<br />Closer than you think.
          </h2>
          <p className="naka-hero-desc">
            Connect directly with verified local tradespeople across 24 Mumbai & Navi Mumbai neighborhoods who work with clear terms.
          </p>

          <div className="naka-hero-actions">
            <Link to="/employer/workers" className="btn-white-action">
              <span>Explore {availableWorkers.length} available workers nearby</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Spotlight Worker Preview */}
        {spotlightWorker ? <div className="naka-hero-spotlight">
          <div className="spotlight-badge">FEATURED TODAY</div>
          <div className="spotlight-card-content">
            <div className="spotlight-avatar-box">
              <span>{spotlightWorker.photo}</span>
              <span className="online-indicator" />
            </div>
            <div className="spotlight-details">
              <span className="spotlight-trade-pill">{spotlightWorker.trade}</span>
              <h4 className="spotlight-name">{spotlightWorker.name}</h4>
              <p className="spotlight-exp">{spotlightWorker.experience} practical experience</p>
              <p className="spotlight-loc">
                <MapPin size={12} /> {spotlightWorker.area}
              </p>
              <div className="spotlight-rating">
                <Star size={13} fill="#ea7e24" stroke="#ea7e24" />
                <span>{spotlightWorker.rating.toFixed(1)} · {spotlightWorker.completedJobs || 42} jobs</span>
              </div>
            </div>
            <Link
              to="/employer/workers"
              className="spotlight-cta-btn"
              title={`View ${spotlightWorker.name}'s profile`}
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div> : <div className="naka-hero-spotlight spotlight-unavailable">
          <div className="spotlight-badge">NO WORKERS AVAILABLE</div>
          <div className="spotlight-card-content">
            <div className="spotlight-details">
              <h4 className="spotlight-name">Check back soon</h4>
              <p className="spotlight-exp">Workers appear here when they mark themselves available.</p>
            </div>
          </div>
        </div>}
      </section>

      {/* Metric Cards Row */}
      <section className="employer-metrics-row">
        <div className="emp-metric-card">
          <div className="metric-icon-wrap icon-green">
            <BriefcaseBusiness size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Active Open Jobs</span>
            <strong className="metric-big-num">{openJobs.length}</strong>
            <span className="metric-footnote">Currently receiving applicants</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-wrap icon-amber">
            <Users size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Interested Workers</span>
            <strong className="metric-big-num">{totalInterested}</strong>
            <span className="metric-footnote">Across active listings</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-wrap icon-teal">
            <CheckCircle2 size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Confirmed Hires</span>
            <strong className="metric-big-num">{confirmedJobs.length}</strong>
            <span className="metric-footnote">Agreed terms recorded</span>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-wrap icon-blue">
            <IndianRupee size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-caption">Registered Tradespeople</span>
            <strong className="metric-big-num">{workers.length}</strong>
            <span className="metric-footnote">Across 24 localities</span>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="employer-dash-grid">
        {/* Recent Jobs Panel */}
        <section className="dash-panel-card">
          <div className="panel-title-bar">
            <div>
              <span className="eyebrow-chip">YOUR LISTINGS</span>
              <h3 className="panel-heading">Recent Job Openings</h3>
            </div>
            <Link to="/employer/jobs" className="panel-link">
              <span>Manage all ({employerJobs.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="dash-jobs-list">
            {employerJobs.slice(0, 5).map(job => (
              <div key={job.id} className="dash-job-row">
                <div className="dash-job-trade-avatar">
                  {getTradeIcon(job.trade)}
                </div>
                <div className="dash-job-info-col">
                  <div className="dash-job-meta-line">
                    <span className="dash-trade-tag">{job.trade}</span>
                    <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(job.employmentType)}`}>
                      {getEmploymentTypeLabel(job.employmentType)}
                    </span>
                    <span className={`dash-status-tag status-${job.status}`}>
                      {job.status === 'confirmed'
                        ? 'Confirmed'
                        : job.status === 'completed'
                        ? 'Completed'
                        : 'Open'}
                    </span>
                  </div>
                  <h4 className="dash-job-title">{job.title}</h4>
                  <p className="dash-job-location">
                    <MapPin size={12} /> {job.neighborhood || job.area} · {job.date}
                  </p>
                </div>

                <div className="dash-job-action-col">
                  <strong className="dash-job-pay">
                    {formatWage(job.wage, job.wageUnit || 'day')}
                  </strong>
                  {job.status === 'open' ? (
                    <button
                      type="button"
                      className="btn-soft-small"
                      onClick={() => handleQuickConfirm(job.id)}
                      disabled={!worker.available}
                      title={!worker.available ? 'This worker is inactive and cannot be assigned' : undefined}
                    >
                      <CheckCircle2 size={13} /> {worker.available ? `Select ${worker.name.split(' ')[0]}` : 'Worker unavailable'}
                    </button>
                  ) : (
                    <span className="confirmed-check-text">
                      <CheckCircle2 size={13} /> {job.status === 'completed' ? 'Finished' : 'Assigned'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="panel-bottom-cta">
            <Link to="/employer/post-job" className="btn-soft-large full-width-btn">
              <Plus size={16} /> Post Another Job Opening
            </Link>
          </div>
        </section>

        {/* Local Naka Bridge Information */}
        <section className="dash-panel-card naka-bridge-panel">
          <div className="panel-title-bar">
            <div>
              <span className="eyebrow-chip">HOW IT WORKS</span>
              <h3 className="panel-heading">The Digital Naka Bridge</h3>
            </div>
            <MapPin size={22} className="bridge-icon" />
          </div>

          <p className="bridge-desc">
            Local workers traditionally gather at the morning chowk. WorkForces brings their skills
            online so you can discover reliable talent, agree on clear terms in advance, and avoid
            hasty site disputes.
          </p>

          <div className="available-workers-preview-box">
            <span className="preview-heading">Available Today in Andheri East & Nearby</span>
            <div className="workers-mini-stack">
              {availableWorkers.slice(0, 4).map(w => (
                <div key={w.id} className="worker-mini-row">
                  <div className="worker-mini-avatar">{w.photo}</div>
                  <div className="worker-mini-info">
                    <strong>{w.name}</strong>
                    <span>{w.trade} · {w.neighborhood}</span>
                  </div>
                  <span className="status-pill-small pill-online">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/employer/workers" className="btn-primary-large full-width-btn">
            Browse {availableWorkers.length} Available Workers <ArrowRight size={16} />
          </Link>
        </section>
      </div>

      {/* Two-Way Demo Sync Banner */}
      <section className="demo-sync-banner">
        <Sparkles size={22} className="sync-icon" />
        <div className="sync-text">
            <strong>Availability-aware hiring:</strong> Only workers marked available appear in the
            directory or can be assigned to an open job.
        </div>
        <Link to="/worker" className="sync-cta-btn">
          Switch to Worker View <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
