import { Link } from 'react-router-dom';

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <Link to="/" className="brand-lockup" title="WorkForces Home">
      <div className="brand-mark-box">
        <img src="/workforces-workers.jpeg" alt="" className="brand-mark-image" />
      </div>
      <div className="brand-text">
        <div className="brand-title">
          <span>Work</span>
          <span className="brand-accent">Forces</span>
        </div>
        {subtitle ? (
          <span className="brand-sub">{subtitle}</span>
        ) : (
          <span className="brand-sub">Skilled hands. Stronger futures.</span>
        )}
      </div>
    </Link>
  );
}
