import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context';
import { getTradeIcon } from '../../components/JobCard';
import { DisputeModal } from '../../components/DisputeModal';
import { RatingModal } from '../../components/RatingModal';
import { formatWage, getEmploymentTypeLabel, getEmploymentTypeBadgeClass } from '../../utils/matching';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock3,
  CalendarDays,
  IndianRupee,
  Wallet,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Share2,
  AlertTriangle,
  X,
  FileCheck,
  HardHat,
  Bookmark,
  Star,
  ShieldAlert,
  XCircle
} from 'lucide-react';
import { CancelModal } from '../../components/CancelModal';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, setJobs, worker, savedJobIds, toggleSaveJob, hasUserRatedJob, addToast } = useStore();

  const [reportModal, setReportModal] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-box">
          <AlertTriangle size={28} />
        </div>
        <h3 className="empty-title">Job listing not found</h3>
        <p className="empty-desc">
          This listing may have already been filled or removed by the employer.
        </p>
        <Link to="/worker/jobs" className="btn-primary-small">
          <ArrowLeft size={14} /> Back to available jobs
        </Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const isConfirmed = job.status === 'confirmed' && job.workerId === worker.id;
  const isCompleted = job.status === 'completed' && job.workerId === worker.id;
  const isPaid = job.paymentStatus === 'paid';
  const hasDispute = job.paymentStatus === 'disputed' || job.paymentDisputed;
  const alreadyRated = hasUserRatedJob(job.id, worker.id);

  const handleAcceptJob = () => {
    setJobs(prev =>
      prev.map(j =>
        j.id === job.id
          ? {
              ...j,
              status: 'confirmed',
              workerId: worker.id,
              paymentStatus: 'pending'
            }
          : j
      )
    );

    addToast(`Job confirmed! Terms saved to your Work Diary.`, 'success');
  };

  const handleShareDetails = async () => {
    const summary = `🛠️ WorkForces Work Confirmation\n• Job: ${job.title} (${getEmploymentTypeLabel(job.employmentType)})\n• Employer: ${job.employer}\n• Agreed Pay: ${formatWage(job.wage, job.wageUnit || 'day')}\n• Hours: ${job.hours}\n• Address: ${job.siteAddress || job.area}\n• Contact: ${job.employerPhone || '+91 98200 12345'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Work Agreement: ${job.title}`,
          text: summary
        });
        addToast('Work details shared with your trusted contact.', 'success');
      } catch {
        // User dismissed share dialog
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      addToast('Agreement details copied! Paste in WhatsApp to share with family.', 'info');
    }
  };

  // If confirmed or completed by this worker
  if (isConfirmed || isCompleted) {
    return (
      <div className="job-confirmation-view">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className={`success-icon-badge ${isCompleted ? 'badge-completed' : ''}`}>
              <CheckCircle2 size={36} />
            </div>
            <div className="eyebrow-chip">
              <FileCheck size={14} />{' '}
              {isCompleted ? 'WORK COMPLETED' : 'BOOKING CONFIRMED & RECORDED'}
            </div>
            <h1 className="confirmation-title">
              {isCompleted ? 'Work Completed' : "You're booked for this work!"}
            </h1>
            <p className="confirmation-sub">
              {isCompleted
                ? 'Agreed terms are permanently logged in your Work Diary.'
                : 'These terms are recorded in your Work Diary. Please keep this screen handy when reporting to site.'}
            </p>
          </div>

          <div className="agreed-summary-box">
            <div className="summary-row">
              <span className="row-label">Work Assignment</span>
              <strong className="row-value">{job.title}</strong>
            </div>
            <div className="summary-row">
              <span className="row-label">Job Duration Type</span>
              <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(job.employmentType)}`}>
                {getEmploymentTypeLabel(job.employmentType)}
              </span>
            </div>
            <div className="summary-row">
              <span className="row-label">Agreed Compensation</span>
              <strong className="row-value wage-highlight">
                {formatWage(job.wage, job.wageUnit || 'day')}
              </strong>
            </div>
            <div className="summary-row">
              <span className="row-label">Payment Status</span>
              {isPaid ? (
                <span className="status-pill-small pill-paid-settled">
                  <CheckCircle2 size={12} /> Paid in Full
                </span>
              ) : hasDispute ? (
                <span className="status-pill-small pill-dispute">
                  <ShieldAlert size={12} /> Dispute Under Review
                </span>
              ) : (
                <span className="status-pill-small pill-pending-pay">
                  <Clock3 size={12} /> Payment Pending
                </span>
              )}
            </div>
            <div className="summary-row">
              <span className="row-label">Reporting Time & Date</span>
              <strong className="row-value">
                {job.hours.split('–')[0]} · {job.date}
              </strong>
            </div>
            <div className="summary-row">
              <span className="row-label">Site Address</span>
              <strong className="row-value">{job.siteAddress || job.area}</strong>
            </div>
            <div className="summary-row">
              <span className="row-label">Employer</span>
              <strong className="row-value">{job.employer}</strong>
            </div>
            <div className="summary-row">
              <span className="row-label">Employer Contact</span>
              <strong className="row-value phone-value">
                <Phone size={14} /> {job.employerPhone || '+91 98200 12345'}
              </strong>
            </div>
            <div className="summary-row">
              <span className="row-label">Payment Mode</span>
              <strong className="row-value">{job.payment}</strong>
            </div>
          </div>

          <div className="confirmation-actions-row">
            <button
              type="button"
              className="btn-primary-large"
              onClick={handleShareDetails}
            >
              <Share2 size={18} /> Share terms with family / trusted contact
            </button>

            <a
              href={`tel:${(job.employerPhone || '+919820012345').replace(/\s+/g, '')}`}
              className="btn-outline-large"
            >
              <Phone size={18} /> Call Employer
            </a>

            {/* Show rating action after completion */}
            {isCompleted && !alreadyRated && (
              <button
                type="button"
                className="btn-soft-large"
                onClick={() => setRatingModalOpen(true)}
              >
                <Star size={16} /> Rate & Review Employer
              </button>
            )}

            {/* REQUIREMENT 3 & 4: If completed and UNPAID, show Report Payment Issue modal.
                If PAID, dispute is completely HIDDEN! */}
            {isCompleted && !isPaid && !hasDispute && (
              <button
                type="button"
                className="btn-ghost-small btn-red"
                onClick={() => setDisputeModalOpen(true)}
              >
                <ShieldAlert size={15} /> Report Payment Issue
              </button>
            )}

            {/* Allow the worker to cancel a task booking */}
            {isConfirmed && !isCompleted && (
              <button
                type="button"
                className="btn-outline-large btn-cancel"
                onClick={() => setCancelModalOpen(true)}
              >
                <XCircle size={18} /> {"Cancel Task Booking"}
              </button>
            )}

            <button
              type="button"
              className="btn-soft-large"
              onClick={() => navigate('/worker/diary')}
            >
              Open My Work Diary <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Cancel Modal (Requirement 10) */}
        {cancelModalOpen && (
          <CancelModal
            job={job}
            cancelledBy="worker"
            onClose={() => setCancelModalOpen(false)}
          />
        )}

        {/* Dispute Modal */}
        {disputeModalOpen && (
          <DisputeModal
            job={job}
            worker={worker}
            onClose={() => setDisputeModalOpen(false)}
          />
        )}

        {/* Rating Modal */}
        {ratingModalOpen && (
          <RatingModal
            job={job}
            reviewerType="worker"
            reviewerId={worker.id}
            reviewerName={worker.name}
            recipientType="employer"
            recipientId={job.employerId || 'emp-greenview'}
            recipientName={job.employer.split(' · ')[0]}
            onClose={() => setRatingModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      {/* Back button */}
      <div className="detail-top-nav">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </button>

        <div className="detail-top-actions">
          <button
            type="button"
            className={`save-btn-round ${isSaved ? 'is-active' : ''}`}
            onClick={() => toggleSaveJob(job.id)}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="detail-content-layout">
        {/* Left column: job scope and terms */}
        <div className="detail-primary-col">
          <div className="detail-badge-strip">
            <span className="trade-pill-detail">
              {getTradeIcon(job.trade)}
              <span>{job.trade}</span>
            </span>
            <span className={`pill-emp-badge ${getEmploymentTypeBadgeClass(job.employmentType)}`}>
              {getEmploymentTypeLabel(job.employmentType)}
            </span>
            <span className="date-pill-detail">{job.date}</span>
            {job.verified && (
              <span className="verified-pill-detail">
                <ShieldCheck size={14} /> Verified Employer
              </span>
            )}
          </div>

          <h1 className="detail-job-heading">{job.title}</h1>

          <div className="job-description-card">
            <h3 className="section-sub-title">Scope of Work</h3>
            <p className="description-body-text">{job.description}</p>
          </div>

          {/* Full Terms Grid */}
          <div className="terms-grid-container">
            <h3 className="section-sub-title">Agreed Work Terms</h3>

            <div className="terms-grid">
              <div className="term-card">
                <div className="term-icon-circle icon-green">
                  <IndianRupee size={20} />
                </div>
                <div className="term-text-wrap">
                  <span className="term-label">Compensation</span>
                  <strong className="term-highlight">
                    {formatWage(job.wage, job.wageUnit || 'day')}
                  </strong>
                </div>
              </div>

              <div className="term-card">
                <div className="term-icon-circle icon-blue">
                  <CalendarDays size={20} />
                </div>
                <div className="term-text-wrap">
                  <span className="term-label">Employment Type</span>
                  <strong className="term-value">{getEmploymentTypeLabel(job.employmentType)}</strong>
                </div>
              </div>

              <div className="term-card">
                <div className="term-icon-circle icon-amber">
                  <Clock3 size={20} />
                </div>
                <div className="term-text-wrap">
                  <span className="term-label">Working Hours</span>
                  <strong className="term-value">{job.hours}</strong>
                </div>
              </div>

              <div className="term-card">
                <div className="term-icon-circle icon-teal">
                  <Wallet size={20} />
                </div>
                <div className="term-text-wrap">
                  <span className="term-label">Payment Timing</span>
                  <strong className="term-value">{job.payment}</strong>
                </div>
              </div>

              <div className="term-card term-span-2">
                <div className="term-icon-circle icon-purple">
                  <MapPin size={20} />
                </div>
                <div className="term-text-wrap">
                  <span className="term-label">Work Site Location</span>
                  <strong className="term-value">
                    {job.siteAddress || job.area} ({job.distance} away)
                  </strong>
                </div>
              </div>

              <div className="term-card term-span-2">
                <div className="term-icon-circle icon-orange">
                  <Wrench size={20} />
                </div>
                <div className="term-text-wrap">
                  <span className="term-label">Tools & Materials Responsibility</span>
                  <strong className="term-value">{job.tools}</strong>
                </div>
              </div>

              {job.safetyGear && (
                <div className="term-card term-span-2">
                  <div className="term-icon-circle icon-gray">
                    <HardHat size={20} />
                  </div>
                  <div className="term-text-wrap">
                    <span className="term-label">Safety Requirements</span>
                    <strong className="term-value">{job.safetyGear}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employer Card */}
          <div className="employer-card-block">
            <div className="employer-card-top">
              <div className="employer-avatar-large">
                {job.employer[0]}
              </div>
              <div className="employer-info">
                <span className="employer-eyebrow">POSTED BY EMPLOYER</span>
                <h4 className="employer-name">{job.employer}</h4>
                <p className="employer-meta">
                  <MapPin size={13} /> {job.neighborhood || job.area} · Verified contractor
                </p>
              </div>
              {job.verified && (
                <div className="employer-verified-badge">
                  <ShieldCheck size={16} />
                  <span>Verified Identity</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: sticky action and acceptance panel */}
        <aside className="detail-action-aside">
          <div className="acceptance-card-sticky">
            <div className="accept-card-top">
              <span className="eyebrow-chip">CONFIRMATION CHECKLIST</span>
              <h3 className="accept-card-title">Ready to take this job?</h3>
              <p className="accept-card-desc">
                Review the wage and reporting time. Once you accept, this job will be booked for you
                and recorded in your Work Diary.
              </p>
            </div>

            <div className="accept-wage-summary">
              <span className="wage-sublabel">GUARANTEED COMPENSATION</span>
              <div className="wage-big-display">
                <span className="currency">₹</span>
                <span className="number">{job.wage.toLocaleString('en-IN')}</span>
                <span className="per">/ {job.wageUnit === 'total' ? 'contract' : job.wageUnit || 'day'}</span>
              </div>
              <span className="payment-timing-tag">{job.payment}</span>
            </div>

            <div className="accept-buttons-stack">
              <button
                type="button"
                className="btn-primary-large"
                onClick={handleAcceptJob}
              >
                <CheckCircle2 size={18} /> Accept This Job
              </button>

              <button
                type="button"
                className="btn-soft-large"
                onClick={handleShareDetails}
              >
                <Share2 size={16} /> Share with Family / Contact
              </button>

              <button
                type="button"
                className="btn-ghost-small"
                onClick={() => setReportModal(true)}
              >
                <AlertTriangle size={14} /> Report suspicious listing
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="modal-backdrop" onClick={() => setReportModal(false)}>
          <div className="modal-dialog-card" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setReportModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="report-modal-icon">
              <AlertTriangle size={28} />
            </div>
            <h3 className="report-modal-title">Report Job Listing</h3>
            <p className="report-modal-desc">
              Does this listing violate fair work standards, list unrealistic terms, or contain misleading employer information?
            </p>
            <div className="report-options">
              <button
                type="button"
                className="report-reason-btn"
                onClick={() => {
                  setReportModal(false);
                  addToast('Listing reported. Our moderation team has been notified.', 'warning');
                }}
              >
                Wage significantly below fair standard
              </button>
              <button
                type="button"
                className="report-reason-btn"
                onClick={() => {
                  setReportModal(false);
                  addToast('Listing reported for hazardous safety conditions.', 'warning');
                }}
              >
                Unsafe working conditions / no safety gear
              </button>
              <button
                type="button"
                className="report-reason-btn"
                onClick={() => {
                  setReportModal(false);
                  addToast('Listing reported for incorrect location details.', 'warning');
                }}
              >
                Incorrect address or employer identity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
