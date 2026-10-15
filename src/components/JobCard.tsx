import { Link } from 'react-router-dom';
import { Job } from '../types';
import { useStore } from '../context';
import { getEmploymentTypeLabel, getEmploymentTypeBadgeClass } from '../utils/matching';
import { MapPin, Clock3, Bookmark, ShieldCheck, ChevronRight, Zap, Droplet, Paintbrush, Hammer, HardHat, Flame, Wrench, CheckCircle2 } from 'lucide-react';

export function getTradeIcon(trade: string) {
  const lower = trade.toLowerCase();
  if (lower.includes('electr')) return <Zap size={18} />;
  if (lower.includes('plumb')) return <Droplet size={18} />;
  if (lower.includes('paint')) return <Paintbrush size={18} />;
  if (lower.includes('carpent')) return <Hammer size={18} />;
  if (lower.includes('weld')) return <Flame size={18} />;
  if (lower.includes('construct') || lower.includes('mason')) return <HardHat size={18} />;
  return <Wrench size={18} />;
}

export function JobCard({ job }: { job: Job }) {
  const { savedJobIds, toggleSaveJob } = useStore();
  const isSaved = savedJobIds.includes(job.id);
  const isConfirmed = job.status === 'confirmed';

  return (
    <div className={`enhanced-job-card ${isConfirmed ? 'is-confirmed' : ''}`}>
      <Link to={`/worker/jobs/${job.id}`} className="job-card-clickable">
        <div className="job-card-header">
          <div className="trade-avatar" data-trade={job.trade.toLowerCase()}>
            {getTradeIcon(job.trade)}
          </div>
          <div className="job-title-group">
            <div className="job-pills-row">
              <span className="pill-trade">{job.trade}</span>
              <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(job.employmentType)}`}>
                {getEmploymentTypeLabel(job.employmentType)}
              </span>
              <span className={`pill-date ${job.date === 'Today' ? 'pill-urgent' : ''}`}>
                {job.date}
              </span>
              {job.verified && (
                <span className="pill-verified" title="Verified employer">
                  <ShieldCheck size={12} /> Verified
                </span>
              )}
            </div>
            <h3 className="job-heading">{job.title}</h3>
            <p className="job-employer-line">
              <span>{job.employer.split(' · ')[0]}</span>
              <span className="bullet">·</span>
              <span className="employer-company">
                {job.employer.split(' · ')[1] || 'Direct Hire'}
              </span>
            </p>
          </div>

          <div className="job-wage-box">
            <div className="wage-amount">
              ₹{job.wage.toLocaleString('en-IN')}
            </div>
            <div className="wage-unit">
              per {job.wageUnit === 'total' ? 'contract' : job.wageUnit || 'day'}
            </div>
            {isConfirmed && (
              <span className="wage-booked-badge">
                <CheckCircle2 size={12} /> Booked
              </span>
            )}
          </div>
        </div>

        <div className="job-card-meta-grid">
          <div className="meta-item">
            <MapPin size={14} className="meta-icon" />
            <span>
              {job.neighborhood || job.area.split(',')[0]}
              {job.city ? `, ${job.city}` : ''}
              <strong className="meta-dist"> ({job.distance})</strong>
            </span>
          </div>
          <div className="meta-item">
            <Clock3 size={14} className="meta-icon" />
            <span>
              {job.hours} <span className="meta-sep">·</span> {job.duration}
            </span>
          </div>
        </div>
      </Link>

      <div className="job-card-actions">
        <button
          type="button"
          className={`save-action-btn ${isSaved ? 'is-saved' : ''}`}
          onClick={e => {
            e.stopPropagation();
            toggleSaveJob(job.id);
          }}
          aria-label={isSaved ? 'Remove from saved jobs' : 'Save job for later'}
          title={isSaved ? 'Remove from saved' : 'Save for later'}
        >
          <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
          <span className="save-label">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <Link
          to={`/worker/jobs/${job.id}`}
          className="view-details-btn"
          aria-label={`View details for ${job.title}`}
        >
          <span>View Terms</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
