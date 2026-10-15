import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context';
import { Job } from '../../types';
import { DisputeModal } from '../../components/DisputeModal';
import { RatingModal } from '../../components/RatingModal';
import { CancelModal } from '../../components/CancelModal';
import { formatWage, getEmploymentTypeLabel, getEmploymentTypeBadgeClass } from '../../utils/matching';
import { CalendarDays, Clock3, CheckCircle2, FileText, MapPin, ArrowRight, IndianRupee, Sparkles, Star, ShieldAlert, Info, XCircle } from 'lucide-react';

export function Diary() {
  const {jobs, setJobs, worker, disputes, hasUserRatedJob, addToast} = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'completed' | 'disputed'>('all');
  const [disputeJob, setDisputeJob] = useState<Job | null>(null);
  const [ratingJob, setRatingJob] = useState<Job | null>(null);
  const [cancellingJob, setCancellingJob] = useState<Job | null>(null);

  const myConfirmed = jobs.filter(j => j.status === 'confirmed' && j.workerId === worker.id);
  const myCompleted = jobs.filter(j => j.status === 'completed' && j.workerId === worker.id);
  const myAll = [...myConfirmed, ...myCompleted];

  const totalAgreed = myAll.reduce((acc, j) => acc + j.wage, 0);
  const totalPaid = myCompleted
    .filter(j => j.paymentStatus === 'paid' && !j.paymentDisputed)
    .reduce((acc, j) => acc + j.wage, 0);
  const totalDisputed = myAll
    .filter(j => j.paymentStatus === 'disputed' || j.paymentDisputed)
    .reduce((acc, j) => acc + j.wage, 0);
  const totalPending = totalAgreed - totalPaid - totalDisputed;

  const markJobDone = (jobId: string) => {
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId
          ? {
              ...j,
              status: 'completed',
              paymentStatus: j.paymentStatus || 'pending'
            }
          : j
      )
    );
    addToast('Work marked as completed! Record whether payment was settled.', 'success');
  };

  const markJobPaid = (jobId: string) => {
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId
          ? {
              ...j,
              paymentStatus: 'paid',
              paymentDisputed: false
            }
          : j
      )
    );
    addToast('Payment recorded as Paid in full.', 'success');
  };

  const filteredList = myAll.filter(j => {
    if (activeTab === 'confirmed') return j.status === 'confirmed';
    if (activeTab === 'completed') return j.status === 'completed';
    if (activeTab === 'disputed') return j.paymentStatus === 'disputed' || j.paymentDisputed;
    return true;
  });

  return (
    <div className="worker-diary-page">
      {/* Page Title */}
      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> DIGITAL WORK LEDGER
          </div>
          <h1 className="page-main-title">My Work Diary</h1>
          <p className="page-main-subtitle">
            A permanent record of your agreed work, completed tasks, payments, and ratings.
          </p>
        </div>
      </div>

      {/* Financial Ledger Card */}
      <section className="diary-financial-card">
        <div className="financial-card-left">
          <div className="eyebrow-chip white-chip">OCTOBER 2026 EARNINGS</div>
          <div className="total-earnings-display">
            <span className="currency-sign">₹</span>
            <span className="total-number">{totalAgreed.toLocaleString('en-IN')}</span>
          </div>
          <p className="earnings-disclaimer">
            Based on agreed job terms. Keep this log updated as work is completed and paid.
          </p>
        </div>

        <div className="financial-breakdown-grid">
          <div className="breakdown-stat-box">
            <span className="stat-label">Paid & Settled</span>
            <strong className="stat-value color-green">₹{totalPaid.toLocaleString('en-IN')}</strong>
          </div>
          <div className="breakdown-stat-box">
            <span className="stat-label">Pending Payment</span>
            <strong className="stat-value color-amber">₹{totalPending.toLocaleString('en-IN')}</strong>
          </div>
          <div className="breakdown-stat-box">
            <span className="stat-label">Disputed / Delayed</span>
            <strong className="stat-value color-red">₹{totalDisputed.toLocaleString('en-IN')}</strong>
          </div>
          <div className="breakdown-stat-box">
            <span className="stat-label">Total Jobs Done</span>
            <strong className="stat-value color-blue">{myCompleted.length}</strong>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        <button
          type="button"
          className={`tab-chip ${activeTab === 'all' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Recorded Work ({myAll.length})
        </button>
        <button
          type="button"
          className={`tab-chip ${activeTab === 'confirmed' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Upcoming / Booked ({myConfirmed.length})
        </button>
        <button
          type="button"
          className={`tab-chip ${activeTab === 'completed' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({myCompleted.length})
        </button>
        <button
          type="button"
          className={`tab-chip ${activeTab === 'disputed' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('disputed')}
        >
          Payment Issues ({myAll.filter(j => j.paymentStatus === 'disputed' || j.paymentDisputed).length})
        </button>
      </div>

      {/* Work Entries List */}
      {filteredList.length > 0 ? (
        <div className="diary-entries-stack">
          {filteredList.map(job => {
            const isDone = job.status === 'completed';
            const isPaid = job.paymentStatus === 'paid';
            const hasDispute = job.paymentStatus === 'disputed' || job.paymentDisputed;
            const activeDispute = disputes.find(d => d.jobId === job.id && d.status !== 'resolved');
            const alreadyRated = hasUserRatedJob(job.id, worker.id);

            return (
              <article
                key={job.id}
                className={`diary-entry-card ${hasDispute ? 'has-dispute' : ''} ${isPaid ? 'is-paid-card' : ''}`}
              >
                <div className="diary-entry-header">
                  <div className="diary-date-badge">
                    <CalendarDays size={18} />
                    <span>{job.date}</span>
                  </div>

                  <div className="diary-title-group">
                    <div className="diary-status-badges">
                      <span className={`status-pill-small ${isDone ? 'pill-done' : 'pill-booked'}`}>
                        {isDone ? 'Completed' : 'Booked'}
                      </span>

                      <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(job.employmentType)}`}>
                        {getEmploymentTypeLabel(job.employmentType)}
                      </span>

                      {/* Payment Status Badges */}
                      {isPaid ? (
                        <span className="status-pill-small pill-paid-settled">
                          <CheckCircle2 size={12} /> Paid in Full
                        </span>
                      ) : hasDispute ? (
                        <span className="status-pill-small pill-dispute">
                          <ShieldAlert size={12} />{' '}
                          {activeDispute?.status === 'acknowledged'
                            ? 'Dispute Acknowledged by Employer'
                            : 'Dispute Under Review'}
                        </span>
                      ) : isDone ? (
                        <span className="status-pill-small pill-pending-pay">
                          <Clock3 size={12} /> Payment Pending
                        </span>
                      ) : null}
                    </div>

                    <h3 className="diary-job-title">{job.title}</h3>
                    <p className="diary-subinfo">
                      <span>{job.employer}</span>
                      <span className="bullet">·</span>
                      <span>
                        <MapPin size={13} /> {job.neighborhood || job.area}
                      </span>
                      <span className="bullet">·</span>
                      <span>
                        <Clock3 size={13} /> {job.hours}
                      </span>
                    </p>
                  </div>

                  <div className="diary-wage-box">
                    <span className="wage-label">AGREED WAGE</span>
                    <strong className="diary-wage-amount">
                      {formatWage(job.wage, job.wageUnit || 'day')}
                    </strong>
                    <span className="wage-timing-text">{job.payment}</span>
                  </div>
                </div>

                <div className="diary-card-footer">
                  <div className="footer-status-text">
                    {isPaid ? (
                      <span className="paid-success-text">
                        <CheckCircle2 size={15} /> Payment recorded & settled in full.
                      </span>
                    ) : hasDispute ? (
                      <span className="dispute-warn-text">
                        <ShieldAlert size={15} />{' '}
                        {activeDispute?.status === 'acknowledged'
                          ? 'Employer acknowledged your dispute. Settlement pending.'
                          : 'Payment dispute under review. Employer has been notified.'}
                      </span>
                    ) : isDone ? (
                      <span className="pending-pay-text">
                        <Clock3 size={15} /> Work finished. Awaiting payment from employer.
                      </span>
                    ) : (
                      <span className="active-work-text">
                        <Clock3 size={15} /> Report to site at {job.hours.split('–')[0]}.
                      </span>
                    )}
                  </div>

                  <div className="diary-actions-group">
                    {/* 1. If not yet done, allow marking done or cancelling booking */}
                    {!isDone && (
                      <>
                        <button
                          type="button"
                          className="btn-primary-small"
                          onClick={() => markJobDone(job.id)}
                        >
                          <CheckCircle2 size={15} /> {"Mark Work Done"}
                        </button>
                        <button
                          type="button"
                          className="btn-outline-small btn-cancel-task"
                          onClick={() => setCancellingJob(job)}
                          title="Cancel your assignment for this task"
                        >
                          <XCircle size={14} /> {"Cancel Booking"}
                        </button>
                      </>
                    )}

                    {/* 2. If done but unpaid, allow recording paid */}
                    {isDone && !isPaid && (
                      <button
                        type="button"
                        className="btn-soft-small"
                        onClick={() => markJobPaid(job.id)}
                        title="Confirm you have received payment"
                      >
                        <IndianRupee size={14} /> Record as Paid
                      </button>
                    )}

                    {/* 3. FIX FOR REQUIREMENT 3: If PAID, HIDE Resolve Dispute completely!
                        Only show dispute button if UNPAID and completed or active */}
                    {!isPaid && !hasDispute && isDone && (
                      <button
                        type="button"
                        className="btn-ghost-small btn-red"
                        onClick={() => setDisputeJob(job)}
                        title="Report missing, partial, or delayed payment"
                      >
                        <ShieldAlert size={14} /> {"Report Payment Issue"}
                      </button>
                    )}

                    {/* If dispute is already under review, show status badge */}
                    {hasDispute && !isPaid && (
                      <span className="dispute-under-review-tag">
                        <Info size={13} /> Dispute Active
                      </span>
                    )}

                    {/* Two-way rating: show rating action after completion */}
                    {isDone && (
                      alreadyRated ? (
                        <span className="rated-feedback-chip">
                          <Star size={13} fill="#ea7e24" stroke="#ea7e24" /> Rated
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn-outline-small"
                          onClick={() => setRatingJob(job)}
                        >
                          <Star size={14} /> {"Rate Employer"}
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
            <FileText size={28} />
          </div>
          <h3 className="empty-title">No entries in this view.</h3>
          <p className="empty-desc">
            When you accept a job listing, its terms are automatically recorded here in your diary.
          </p>
          <Link to="/worker/jobs" className="btn-primary-small">
            Explore available jobs <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeJob && (
        <DisputeModal
          job={disputeJob}
          worker={worker}
          onClose={() => setDisputeJob(null)}
        />
      )}

      {/* Rating Modal (Worker rates Employer) */}
      {ratingJob && (
        <RatingModal
          job={ratingJob}
          reviewerType="worker"
          reviewerId={worker.id}
          reviewerName={worker.name}
          recipientType="employer"
          recipientId={ratingJob.employerId || 'emp-greenview'}
          recipientName={ratingJob.employer.split(' · ')[0]}
          onClose={() => setRatingJob(null)}
        />
      )}

      {/* Cancel Task Modal (Requirement 10) */}
      {cancellingJob && (
        <CancelModal
          job={cancellingJob}
          cancelledBy="worker"
          onClose={() => setCancellingJob(null)}
        />
      )}
    </div>
  );
}
