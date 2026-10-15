import { useState, type FormEvent } from 'react';
import { Job } from '../types';
import { useStore } from '../context';
import { X, AlertTriangle } from 'lucide-react';

type CancelModalProps = {
  job: Job;
  cancelledBy: 'worker' | 'employer';
  onClose: () => void;
};

const WORKER_CANCEL_REASONS = [
  'Family emergency or personal unavoidable reason',
  'Schedule conflict / accepted other urgent job',
  'Site location is too far / transport issues',
  'Health or medical issue today',
  'Employer changed agreed rate or work scope',
  'Other'
];

const EMPLOYER_CANCEL_REASONS = [
  'Work postponed or rescheduled to a later date',
  'Found alternative worker locally at naka',
  'Materials / site access not ready',
  'Budget issue / project scope cancelled',
  'Worker did not respond or report to site',
  'Other'
];

export function CancelModal({ job, cancelledBy, onClose }: CancelModalProps) {
  const {cancelJob} = useStore();
  const reasons = cancelledBy === 'worker' ? WORKER_CANCEL_REASONS : EMPLOYER_CANCEL_REASONS;

  const [selectedReason, setSelectedReason] = useState<string>(reasons[0]);
  const [otherText, setOtherText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!reasons.includes(selectedReason)) {
      setError('Please select a cancellation reason.');
      return;
    }

    if (selectedReason === 'Other' && (!otherText.trim() || otherText.trim().length < 5 || otherText.trim().length > 500)) {
      setError('Please provide an explanation between 5 and 500 characters.');
      return;
    }

    const finalReason = selectedReason === 'Other' ? otherText.trim() : selectedReason;
    cancelJob(job.id, finalReason, cancelledBy);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-card cancel-modal-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="cancel-modal-header">
          <div className="cancel-icon-box">
            <AlertTriangle size={26} />
          </div>
          <div>
            <span className="eyebrow-chip">TASK CANCELLATION</span>
            <h2 className="modal-heading">
              {cancelledBy === 'worker'
                ? "Cancel Task Booking"
                : "Cancel Job Posting"}
            </h2>
          </div>
        </div>

        <p className="cancel-sub-intro">
          {cancelledBy === 'worker' ? (
            <>
              You are withdrawing from <strong>"{job.title}"</strong> posted by{' '}
              <strong>{job.employer}</strong>. The employer will be notified immediately.
            </>
          ) : (
            <>
              You are cancelling <strong>"{job.title}"</strong>.
              {job.workerId ? ' The assigned worker will receive an immediate cancellation alert.' : ''}
            </>
          )}
        </p>

        <form onSubmit={handleSubmit} className="cancel-form">
          <div className="cancel-reasons-group">
            <label className="field-label">Select reason for cancellation *</label>
            <div className="reasons-radio-list">
              {reasons.map(reason => (
                <label
                  key={reason}
                  className={`cancel-radio-item ${selectedReason === reason ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => {
                      setSelectedReason(reason);
                      setError('');
                    }}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div className="other-reason-input-block">
              <label className="field-label">Please explain why *</label>
              <textarea
                className="textarea-input"
                rows={2}
                placeholder="Explain the reason for cancelling..."
                value={otherText}
                onChange={e => {
                  setOtherText(e.target.value);
                  setError('');
                }}
                required
                maxLength={500}
              />
            </div>
          )}

          {error && (
            <div className="form-error-banner">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="cancel-notice-box">
            <small>
              ℹ️ WorkForces maintains transparent cancellation history. Cancellations with valid notice keep your account in good standing.
            </small>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-outline-small" onClick={onClose}>
              {"Keep Booking"}
            </button>
            <button type="submit" className="btn-danger-large">
              {"Confirm & Cancel Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
