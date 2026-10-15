import { useState, type FormEvent } from 'react';
import { Job, Worker } from '../types';
import { useStore } from '../context';
import { formatWage } from '../utils/matching';
import { AlertCircle, X, ShieldAlert, Clock } from 'lucide-react';

type DisputeModalProps = {
  job: Job;
  worker: Worker;
  onClose: () => void;
};

const DISPUTE_REASONS = [
  'Payment not received',
  'Partial payment received',
  'Incorrect payment amount',
  'Employer is not responding',
  'Other'
];

export function DisputeModal({ job, worker, onClose }: DisputeModalProps) {
  const { submitDispute } = useStore();
  const [reason, setReason] = useState<string>('Payment not received');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!DISPUTE_REASONS.includes(reason)) {
      setError('Please select a dispute reason.');
      return;
    }
    if (description.trim().length > 1000) {
      setError('Additional details must be 1,000 characters or fewer.');
      return;
    }
    if (reason === 'Other' && description.trim().length < 10) {
      setError('Please add at least 10 characters explaining the dispute.');
      return;
    }

    submitDispute({
      jobId: job.id,
      jobTitle: job.title,
      workerId: worker.id,
      workerName: worker.name,
      employerId: job.employerId || 'emp-greenview',
      employerName: job.employer,
      amount: job.wage,
      wageUnit: job.wageUnit || 'day',
      reason,
      description: description.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-card dispute-modal-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="dispute-modal-header">
          <div className="dispute-icon-circle">
            <ShieldAlert size={28} />
          </div>
          <div>
            <span className="eyebrow-chip">PAYMENT DISPUTE ALERT</span>
            <h2 className="modal-heading">Report Payment Issue</h2>
          </div>
        </div>

        {/* Job Details Card */}
        <div className="dispute-job-summary-box">
          <div className="dispute-summary-row">
            <span className="summary-label">Job Assignment:</span>
            <strong className="summary-val">{job.title}</strong>
          </div>
          <div className="dispute-summary-row">
            <span className="summary-label">Employer:</span>
            <strong className="summary-val">{job.employer}</strong>
          </div>
          <div className="dispute-summary-row">
            <span className="summary-label">Agreed Compensation:</span>
            <strong className="summary-val wage-highlight">
              {formatWage(job.wage, job.wageUnit || 'day')}
            </strong>
          </div>
          <div className="dispute-summary-row">
            <span className="summary-label">Current Payment Status:</span>
            <span className="status-pill-small pill-dispute">
              <Clock size={12} /> Payment Pending / Unpaid
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="dispute-form">
          <label className="field-block">
            <span className="field-label">Reason for Dispute *</span>
            <div className="dispute-reason-radios">
              {DISPUTE_REASONS.map(r => (
                <label key={r} className={`radio-pill-item ${reason === r ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="dispute-reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => {
                      setReason(r);
                      setError('');
                    }}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </label>

          <label className="field-block">
            <span className="field-label">Additional Details / Notes {reason === 'Other' ? '*' : '(Optional)'}</span>
            <textarea
              className="textarea-input"
              rows={3}
              placeholder="Provide any helpful context, such as hours completed, agreed revisions, or previous conversations with the employer..."
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                setError('');
              }}
              maxLength={1000}
              aria-invalid={Boolean(error)}
              required={reason === 'Other'}
            />
          </label>

          {error && (
            <div className="form-error-banner">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="dispute-demo-disclaimer">
            <AlertCircle size={14} className="disclaimer-icon" />
            <span>
              <strong>In-App Demo Alert:</strong> Submitting this dispute notifies the employer directly inside the application to review and resolve payment. This is a prototype feature and does not constitute a formal legal or government escalation.
            </span>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-outline-large" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-large btn-danger-action">
              <ShieldAlert size={16} /> Submit Dispute Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
