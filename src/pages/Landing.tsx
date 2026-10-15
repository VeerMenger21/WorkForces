import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand';
import { LanguageToggle } from '../i18n';
import { ArrowRight, ShieldCheck, UserRound, BriefcaseBusiness, CalendarDays, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export function Landing() {

  return (
    <div className="landing-page-wrap">
      {/* Top Navbar */}
      <header className="landing-topbar">
        <Brand subtitle="Skilled hands. Stronger futures." />

        <div className="landing-top-actions">
          <LanguageToggle />
          <Link to="/signin" className="btn-primary-small">
            Sign in <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-content-col">
          <div className="eyebrow-chip">
            <span className="live-pulse" />
            <span>DIGITAL NAKA · CONNECTING LOCAL WORK</span>
          </div>

          <h1 className="hero-headline">
            Your skills<br />
            deserve to be <em className="hero-accent">seen.</em>
          </h1>

          <p className="hero-subheadline">
            Good work starts with being found. WorkForces bridges local skilled workers with nearby
            employers through clear terms, upfront wages, and trusted connections.
          </p>

          <div className="hero-portal-cards-grid">
            <Link to="/signin/worker" className="portal-launch-card worker-portal-card">
              <div className="portal-card-icon icon-worker">
                <UserRound size={26} />
              </div>
              <div className="portal-card-text">
                <span className="portal-target-label">FOR WORKERS & TRADESPEOPLE</span>
                <h3 className="portal-target-title">
                  Find Work
                </h3>
                <p className="portal-target-desc">
                  Mark available today and record agreed daily wages.
                </p>
                <span className="portal-cta-inline">
                Sign in to Worker Workspace <ArrowRight size={15} />
                </span>
              </div>
            </Link>

            <Link to="/signin/client" className="portal-launch-card employer-portal-card">
              <div className="portal-card-icon icon-employer">
                <BriefcaseBusiness size={26} />
              </div>
              <div className="portal-card-text">
                <span className="portal-target-label">FOR CONTRACTORS & HOMES</span>
                <h3 className="portal-target-title">
                  Hire Workers
                </h3>
                <p className="portal-target-desc">
                  Discover verified local electricians, plumbers, painters, and carpenters with fair terms.
                </p>
                <span className="portal-cta-inline">
                Sign in to Client Workspace <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </div>

          <div className="hero-trust-badges">
            <span className="trust-item">
              <ShieldCheck size={16} /> 100% Upfront wage transparency
            </span>
            <span className="trust-item">
              <CheckCircle2 size={16} /> Zero commission on daily work
            </span>
            <span className="trust-item">
              <MapPin size={16} /> Local jobs matched by distance
            </span>
          </div>
        </div>

        {/* Hero Graphic Column */}
        <div className="hero-graphic-col">
          <div className="hero-artwork-canvas">
            <div className="art-sun-glow" />
            <div className="art-naka-arch" />

            {/* Floating Live Simulation Cards */}
            <div className="floating-card float-top-left">
              <div className="float-icon-box">
                <MapPin size={18} />
              </div>
              <div>
                <strong>Andheri East Naka</strong>
                <small>Connected with 24+ active jobs</small>
              </div>
            </div>

            <div className="floating-card float-bottom-right">
              <div className="worker-mini-avatar-badge">RP</div>
              <div>
                <strong>Ramesh Patil</strong>
                <small>Electrician · Available Today</small>
              </div>
              <span className="pulse-green-dot" />
            </div>

          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="landing-features-section">
        <div className="section-center-head">
          <div className="eyebrow-chip">BUILT FOR DIGNITY</div>
          <h2 className="section-head-title">How WorkForces Transforms Daily Work</h2>
          <p className="section-head-sub">
            Replacing uncertainty and endless negotiation with clarity and respect.
          </p>
        </div>

        <div className="features-three-grid">
          <div className="feature-block-card">
            <div className="feature-icon-circle icon-green">
              <Sparkles size={24} />
            </div>
            <h3 className="feature-block-title">The Digital Naka</h3>
            <p className="feature-block-desc">
              Workers continue meeting at familiar community chowks. Meanwhile, their availability and
              verified skills are searchable by verified local contractors.
            </p>
          </div>

          <div className="feature-block-card">
            <div className="feature-icon-circle icon-amber">
              <ShieldCheck size={24} />
            </div>
            <h3 className="feature-block-title">Clear Job Terms</h3>
            <p className="feature-block-desc">
              Workers can review the scope, agreed wage, working hours, and site address before accepting any job.
            </p>
          </div>

          <div className="feature-block-card">
            <div className="feature-icon-circle icon-teal">
              <CalendarDays size={24} />
            </div>
            <h3 className="feature-block-title">Work Diary & Grievance Safety</h3>
            <p className="feature-block-desc">
              Every accepted assignment records agreed wages and hours. If payment is ever delayed,
              workers have instant access to Labour Ministry dispute remedies.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-left">
          <Brand />
          <p className="footer-tagline">
            Built for the people who build and keep our cities running.
          </p>
        </div>
        <div className="footer-right">
          <span className="footer-badge">
            <ShieldCheck size={14} /> WORKFORCES · LOCAL WORK, MADE VISIBLE
          </span>
        </div>
      </footer>
    </div>
  );
}
