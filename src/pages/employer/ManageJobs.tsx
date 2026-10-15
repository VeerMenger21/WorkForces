import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context';
import { Job } from '../../types';
import { getTradeIcon } from '../../components/JobCard';
import { RatingModal } from '../../components/RatingModal';
import { CancelModal } from '../../components/CancelModal';
import { formatWage, getEmploymentTypeLabel, getEmploymentTypeBadgeClass } from '../../utils/matching';
import { BriefcaseBusiness, Plus, MapPin, CheckCircle2, Users, Phone, IndianRupee, Sparkles, ShieldAlert, Star, Check, XCircle } from 'lucide-react';

export function ManageJobs() {
  const {
    jobs,
    setJobs,
    worker,
    workers,
    currentEmployer,
    disputes,
    acknowledgeDispute,
    resolveDispute,
    hasUserRatedJob,
    addToast
  } = useStore();

  const [filter, setFilter] = useState<'all' | 'open' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [ratingJob, setRatingJob] = useState<Job | null>(null);
  const [cancellingJob, setCancellingJob] = useState<Job | null>(null);

  const employerJobs = jobs.filter(j => j.employerId === currentEmployer.id);
  const filteredJobs = employerJobs.filter(j => {
    if (filter === 'open') return j.status === 'open';
    if (filter === 'confirmed') return j.status === 'confirmed';
    if (filter === 'completed') return j.status === 'completed';
    if (filter === 'cancelled') return j.status === 'cancelled';
    return true;
  });

  const handleConfirmWorker = (job: Job) => {
    if (!worker.available) {
      addToast(`${worker.name} is currently unavailable and cannot be assigned.`, 'warning');
      return;
    }

    setJobs(prev =>
      prev.map(j =>
        j.id === job.id && j.employerId === currentEmployer.id && j.status === 'open'
          ? {
              ...j,
              status: 'confirmed',
              workerId: worker.id,
              paymentStatus: 'pending'
            }
          : j
      )
    );
    addToast(`${worker.name} confirmed for "${job.title}". Synced with worker diary.`, 'success');
  };

  const handleMarkCompleted = (jobId: string) => {
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId && j.employerId === currentEmployer.id && j.status === 'confirmed'
          ? {
              ...j,
              status: 'completed',
              paymentStatus: 'paid',
              paymentDisputed: false
            }
          : j
      )
    );
    addToast('Work marked as completed and payment settled in full.', 'success');
  };

  return (
    <div className="employer-manage-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> CONTRACTOR DASHBOARD
          </div>
          <h1 className="page-main-title">Manage Your Job Openings</h1>
          <p className="page-main-subtitle">
            Review active listings, confirm skilled workers, track disputes, and submit ratings.
          </p>
        </div>

        <Link to="/employer/post-job" className="btn-primary-small">
          <Plus size={16} /> Post a New Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="filter-tabs-row">
        <button
          type="button"
          className={`tab-chip ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Listings ({employerJobs.length})
        </button>
        <button
          type="button"
          className={`tab-chip ${filter === 'open' ? 'is-active' : ''}`}
          onClick={() => setFilter('open')}
        >
          Open ({employerJobs.filter(j => j.status === 'open').length})
        </button>
        <button
          type="button"
          className={`tab-chip ${filter === 'confirmed' ? 'is-active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed / Booked ({employerJobs.filter(j => j.status === 'confirmed').length})
        </button>
        <button
          type="button"
          className={`tab-chip ${filter === 'completed' ? 'is-active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({employerJobs.filter(j => j.status === 'completed').length})
        </button>
        <button
          type="button"
          className={`tab-chip ${filter === 'cancelled' ? 'is-active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({employerJobs.filter(j => j.status === 'cancelled').length})
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="manage-jobs-stack">
          {filteredJobs.map(job => {
            const isConfirmed = job.status === 'confirmed';
            const isCompleted = job.status === 'completed';
            const isOpen = job.status === 'open';
            const assignedWorker = workers.find(w => w.id === job.workerId) || (job.workerId ? worker : null);
            const activeDispute = disputes.find(d => d.jobId === job.id && d.status !== 'resolved');
            const alreadyRated = hasUserRatedJob(job.id, currentEmployer.id);

            return (
              <article key={job.id} className={`manage-job-card ${activeDispute ? 'has-dispute-alert' : ''}`}>
                <div className="manage-card-top">
                  <div className="manage-trade-avatar">
                    {getTradeIcon(job.trade)}
                  </div>
                  <div className="manage-title-group">
                    <div className="manage-pills">
                      <span className="pill-trade">{job.trade}</span>
                      <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(job.employmentType)}`}>
                        {getEmploymentTypeLabel(job.employmentType)}
                      </span>
                      <span className="pill-date">{job.date}</span>
                      <span className={`status-pill-small status-${job.status}`}>
                        {isConfirmed ? 'Confirmed / Booked' : isCompleted ? 'Completed' : 'Open'}
                      </span>
                      {job.paymentStatus === 'paid' && (
                        <span className="status-pill-small pill-paid-settled">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      )}
                    </div>
                    <h3 className="manage-job-heading">{job.title}</h3>
                    <p className="manage-loc-line">
                      <MapPin size={13} /> {job.siteAddress || job.neighborhood || job.area} · {job.hours}
                    </p>
                  </div>

                  <div className="manage-wage-group">
                    <span className="wage-sublabel">COMPENSATION</span>
                    <strong className="manage-wage-fig">
                      {formatWage(job.wage, job.wageUnit || 'day')}
                    </strong>
                    <span className="manage-wage-unit">{job.payment}</span>
                  </div>
                </div>

                {/* Dispute Alert on Job Card (Requirement 4) */}
                {activeDispute && (
                  <div className="manage-dispute-banner">
                    <ShieldAlert size={18} className="dispute-banner-icon" />
                    <div className="dispute-banner-text">
                      <strong>Payment Dispute Under Review:</strong> {activeDispute.workerName} reported "{activeDispute.reason}".
                      {activeDispute.description && <p>"{activeDispute.description}"</p>}
                    </div>
                    <div className="dispute-banner-actions">
                      {activeDispute.status === 'under_review' ? (
                        <button
                          type="button"
                          className="btn-outline-small"
                          onClick={() => acknowledgeDispute(activeDispute.id)}
                        >
                          <Check size={13} /> Acknowledge
                        </button>
                      ) : (
                        <span className="status-pill-small pill-online">✓ Acknowledged</span>
                      )}
                      <button
                        type="button"
                        className="btn-primary-small"
                        onClick={() => resolveDispute(activeDispute.id)}
                      >
                        <IndianRupee size={13} /> Settle & Mark Paid
                      </button>
                    </div>
                  </div>
                )}

                {/* Terms Row */}
                <div className="manage-terms-matrix">
                  <div className="manage-term-item">
                    <span className="term-sub">DURATION TYPE</span>
                    <strong className="term-val">{getEmploymentTypeLabel(job.employmentType)}</strong>
                  </div>
                  <div className="manage-term-item">
                    <span className="term-sub">PAYMENT MODE</span>
                    <strong className="term-val">{job.payment}</strong>
                  </div>
                  <div className="manage-term-item">
                    <span className="term-sub">REQUIRED TOOLS</span>
                    <strong className="term-val">{job.tools}</strong>
                  </div>
                  <div className="manage-term-item">
                    <span className="term-sub">APPLICANTS</span>
                    <strong className="term-val">
                      <Users size={13} /> {job.interested + (job.workerId ? 1 : 0)} Interested
                    </strong>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="manage-card-footer">
                  <div className="footer-worker-status">
                    {isConfirmed && assignedWorker ? (
                      <span className="worker-assigned-pill">
                        <CheckCircle2 size={15} /> Worker Assigned: <strong>{assignedWorker.name}</strong> ({assignedWorker.phone})
                      </span>
                    ) : isCompleted ? (
                      <span className="worker-assigned-pill color-green">
                        <CheckCircle2 size={15} /> Job Completed & Settled
                      </span>
                    ) : (
                      <span className="applicants-count-text">
                        <Users size={14} /> {job.interested} workers viewed this nearby
                      </span>
                    )}
                  </div>

                  <div className="manage-actions-buttons">
                    {isOpen && (
                      <button
                        type="button"
                        className="btn-primary-small"
                        onClick={() => handleConfirmWorker(job)}
                        disabled={!worker.available}
                        title={!worker.available ? 'This worker is inactive and cannot be assigned' : undefined}
                      >
                        <CheckCircle2 size={14} /> {worker.available ? `Confirm ${worker.name.split(' ')[0]}` : 'Worker unavailable'}
                      </button>
                    )}

                    {isConfirmed && assignedWorker && (
                      <>
                        <a
                          href={`tel:${assignedWorker.phone.replace(/\s+/g, '')}`}
                          className="btn-outline-small"
                        >
                          <Phone size={14} /> Call {assignedWorker.name.split(' ')[0]}
                        </a>
                        <button
                          type="button"
                          className="btn-primary-small"
                          onClick={() => handleMarkCompleted(job.id)}
                        >
                          <CheckCircle2 size={14} /> Mark Work Done & Paid
                        </button>
                      </>
                    )}

                    {/* Allow the employer to cancel a job or booking */}
                    {(isOpen || isConfirmed) && (
                      <button
                        type="button"
                        className="btn-outline-small btn-cancel-job"
                        onClick={() => setCancellingJob(job)}
                        title={isConfirmed ? 'Cancel booking with worker' : 'Cancel and archive job listing'}
                      >
                        <XCircle size={14} /> {isConfirmed ? "Cancel Booking" : "Cancel Job"}
                      </button>
                    )}

                    {/* If cancelled, show cancelled badge */}
                    {job.status === 'cancelled' && (
                      <span className="status-pill-small pill-cancelled">
                        {"Cancelled"} ({job.cancellationReason || 'Listing cancelled'})
                      </span>
                    )}

                    {/* Employer can rate the worker after completion */}
                    {isCompleted && assignedWorker && (
                      alreadyRated ? (
                        <span className="rated-feedback-chip">
                          <Star size={13} fill="#ea7e24" stroke="#ea7e24" /> Worker Rated
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn-outline-small"
                          onClick={() => setRatingJob(job)}
                        >
                          <Star size={14} /> {"Rate Worker"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <BriefcaseBusiness size={28} />
          </div>
          <h3 className="empty-title">No listings match this filter.</h3>
          <p className="empty-desc">
            Post clear terms to attract skilled electricians, plumbers, painters, and carpenters across Mumbai & Navi Mumbai.
          </p>
          <Link to="/employer/post-job" className="btn-primary-small">
            <Plus size={15} /> Post a work opportunity
          </Link>
        </div>
      )}

      {/* Cancel Modal (Requirement 10) */}
      {cancellingJob && (
        <CancelModal
          job={cancellingJob}
          cancelledBy="employer"
          onClose={() => setCancellingJob(null)}
        />
      )}

      {/* Rating Modal (Employer rates Worker) */}
      {ratingJob && (
        <RatingModal
          job={ratingJob}
          reviewerType="employer"
          reviewerId={currentEmployer.id}
          reviewerName={currentEmployer.name}
          recipientType="worker"
          recipientId={ratingJob.workerId || worker.id}
          recipientName={
            workers.find(w => w.id === ratingJob.workerId)?.name || worker.name
          }
          onClose={() => setRatingJob(null)}
        />
      )}
    </div>
  );
}
