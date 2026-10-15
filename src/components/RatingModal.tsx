import { useState, type FormEvent } from 'react';
import { Job } from '../types';
import { useStore } from '../context';
import { Star, X, CheckCircle2, AlertCircle } from 'lucide-react';

type RatingModalProps = {
  job: Job;
  reviewerType: 'worker' | 'employer';
  reviewerId: string;
  reviewerName: string;
  recipientType: 'worker' | 'employer';
  recipientId: string;
  recipientName: string;
  onClose: () => void;
};

// Uber-style dynamic rating feedback options
const WORKER_FEEDBACK_TIERS = {
  low: [ // 1 - 2 Stars: What went wrong?
    'Payment delayed significantly',
    'Paid less than agreed wage',
    'Rude or disrespectful behavior',
    'Unsafe site condition',
    'Forced unpaid overtime',
    'Work did not match description',
    'No basic water / amenities',
    'Unresponsive communication'
  ],
  mid: [ // 3 Stars: What could improve?
    'Minor payment delay',
    'Unclear instructions initially',
    'Materials not ready on time',
    'Site facilities could improve',
    'Moderate communication delay'
  ],
  high: [ // 4 - 5 Stars: What went well?
    'Prompt full payment via UPI',
    'Agreed wage respected in full',
    'Polite & respectful behavior',
    'Clear instructions & scope',
    'Water, tea & amenities offered',
    'Safe working environment',
    'Fast replies & coordination',
    'Would gladly work with again!'
  ]
};

const EMPLOYER_FEEDBACK_TIERS = {
  low: [ // 1 - 2 Stars: What went wrong?
    'Poor quality / incomplete work',
    'Arrived very late / no show',
    'Asked for higher wage on site',
    'Unprofessional or rude conduct',
    'Did not bring necessary tools',
    'Left work area dirty / messy',
    'Ignored clear instructions',
    'Material wastage or damage'
  ],
  mid: [ // 3 Stars: What could improve?
    'Average workmanship finish',
    'Needed constant supervision',
    'Arrived slightly late',
    'Tool shortage on site',
    'Took longer than estimated'
  ],
  high: [ // 4 - 5 Stars: What went well?
    'Expert craftsmanship & finish',
    'Arrived right on time',
    'Polite, honest & professional',
    'Cleaned up workspace thoroughly',
    'Brought complete tools',
    'Quick & efficient turnaround',
    'Followed safety precautions',
    'Highly recommended / Hire again'
  ]
};

const STAR_LABELS = ['', 'Terrible (1/5)', 'Poor (2/5)', 'Average (3/5)', 'Very Good (4/5)', 'Excellent (5/5)'];

export function RatingModal({
  job,
  reviewerType,
  reviewerId,
  reviewerName,
  recipientType,
  recipientId,
  recipientName,
  onClose
}: RatingModalProps) {
  const { submitRating } = useStore();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  const currentTier: 'low' | 'mid' | 'high' =
    rating <= 2 ? 'low' : rating === 3 ? 'mid' : 'high';

  const tierCategories =
    reviewerType === 'worker'
      ? WORKER_FEEDBACK_TIERS[currentTier]
      : EMPLOYER_FEEDBACK_TIERS[currentTier];

  const handleStarChange = (num: number) => {
    setRating(num);
    setError('');
    // Clear previous categories if switching tiers (e.g. from 5-star positive to 1-star negative)
    const newTier: 'low' | 'mid' | 'high' = num <= 2 ? 'low' : num === 3 ? 'mid' : 'high';
    if (newTier !== currentTier) {
      setSelectedCategories([]);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }
    if (comment.trim().length > 300) {
      setError('Comments must be 300 characters or fewer.');
      return;
    }

    submitRating({
      jobId: job.id,
      jobTitle: job.title,
      reviewerType,
      reviewerId,
      reviewerName,
      recipientType,
      recipientId,
      recipientName,
      rating,
      categories: selectedCategories,
      comment: comment.trim() || undefined
    });
    onClose();
  };

  const getTierPrompt = () => {
    if (currentTier === 'low') return 'What went wrong? (Select all that apply)';
    if (currentTier === 'mid') return 'What could be improved?';
    return 'What did you like most?';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-card rating-modal-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="rating-modal-header">
          <div className="rating-icon-box">
            <Star size={26} fill="#ea7e24" stroke="#ea7e24" />
          </div>
          <div>
            <span className="eyebrow-chip">TWO-WAY FEEDBACK</span>
            <h2 className="modal-heading">
              {reviewerType === 'worker'
                ? "Rate Employer"
                : "Rate Worker"}
            </h2>
          </div>
        </div>

        <p className="rating-sub-intro">
          How was your experience working with <strong>{recipientName}</strong> for "
          <em>{job.title}</em>"?
        </p>

        <form onSubmit={handleSubmit} className="rating-form">
          {/* Accessible Star Rating Selector */}
          <div className="star-picker-container">
            <div className="star-buttons-row" role="radiogroup" aria-label="Select star rating">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  className="star-pick-btn"
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleStarChange(num)}
                  aria-label={`${num} stars`}
                  aria-checked={rating === num}
                  role="radio"
                >
                  <Star
                    size={34}
                    className={`star-icon ${(hoverRating || rating) >= num ? 'is-filled' : 'is-empty'}`}
                    fill={(hoverRating || rating) >= num ? '#ea7e24' : 'none'}
                    stroke={(hoverRating || rating) >= num ? '#ea7e24' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
            <span className={`star-rating-label tier-${currentTier}`}>
              {STAR_LABELS[hoverRating || rating] || 'Select rating'}
            </span>
          </div>

          {/* Uber-style Dynamic Category Chips */}
          <div className="rating-categories-block">
            <span className="field-label">{getTierPrompt()}</span>
            <div className="category-chips-grid">
              {tierCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`category-chip-btn ${isSelected ? 'is-selected' : ''} ${
                      currentTier === 'low' ? 'chip-negative' : currentTier === 'mid' ? 'chip-neutral' : 'chip-positive'
                    }`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {isSelected && <CheckCircle2 size={13} />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment / Written Feedback */}
          <div className="rating-comment-block">
            <label className="field-label">Additional Comments (Optional)</label>
            <textarea
              className="textarea-input"
              rows={3}
              placeholder={
                currentTier === 'low'
                  ? 'Please share details of what happened...'
                  : 'Write a few words about your experience...'
              }
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={300}
            />
            <small className="char-count">{comment.length}/300</small>
          </div>

          {error && (
            <div className="form-error-banner">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions-row">
            <button type="button" className="btn-outline-small" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-large">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
