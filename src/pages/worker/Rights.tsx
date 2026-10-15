import { ShieldCheck, Scale, Clock3, IndianRupee, HardHat, PhoneCall, ExternalLink, FileText, Sparkles } from 'lucide-react';

export function Rights() {
  return (
    <div className="worker-rights-page">
      {/* Page Title */}
      <div className="page-header-block">
        <div className="header-text-side">
          <div className="eyebrow-chip">
            <Sparkles size={13} /> DIGNITY & LEGAL PROTECTIONS
          </div>
          <h1 className="page-main-title">Worker Rights & Grievance Help</h1>
          <p className="page-main-subtitle">
            Every day of hard work deserves clear terms, timely payment, and safe working conditions.
          </p>
        </div>
      </div>

      {/* Hero Dignity Banner */}
      <section className="rights-hero-banner">
        <div className="rights-hero-icon-box">
          <ShieldCheck size={32} />
        </div>
        <div className="rights-hero-text">
          <h3 className="rights-banner-heading">Your work has dignity and legal backing.</h3>
          <p className="rights-banner-desc">
            Never start work without confirming four essential terms: Daily Wage, Working Hours, Site
            Address, and who provides heavy materials & safety gear.
          </p>
        </div>
      </section>

      {/* Rights Grid */}
      <div className="rights-cards-grid">
        <article className="rights-info-card">
          <div className="rights-card-header">
            <span className="rights-num-badge">01</span>
            <div className="rights-icon-wrap icon-green">
              <IndianRupee size={20} />
            </div>
          </div>
          <h3 className="rights-card-title">Right to Agreed Wage & Timely Pay</h3>
          <p className="rights-card-desc">
            Under the Payment of Wages Act, daily wage workers must be paid at the close of work or
            the agreed payment milestone without arbitrary deductions.
          </p>
          <ul className="rights-bullets">
            <li>Always confirm whether pay is daily cash or UPI before leaving.</li>
            <li>Take a photo of the completed work or site as proof.</li>
            <li>Do not hand over personal original ID documents to contractors.</li>
          </ul>
        </article>

        <article className="rights-info-card">
          <div className="rights-card-header">
            <span className="rights-num-badge">02</span>
            <div className="rights-icon-wrap icon-amber">
              <Clock3 size={20} />
            </div>
          </div>
          <h3 className="rights-card-title">8-Hour Shift & Overtime Pay</h3>
          <p className="rights-card-desc">
            Standard daily work shifts are 8 hours (with a mandatory 30–60 minute meal break). Any
            work performed beyond agreed hours requires additional overtime compensation.
          </p>
          <ul className="rights-bullets">
            <li>Record your arrival time and completion time in your diary.</li>
            <li>Agree on extra hourly rates if site work extends past 6:00 PM.</li>
          </ul>
        </article>

        <article className="rights-info-card">
          <div className="rights-card-header">
            <span className="rights-num-badge">03</span>
            <div className="rights-icon-wrap icon-blue">
              <HardHat size={20} />
            </div>
          </div>
          <h3 className="rights-card-title">Safe Working Conditions</h3>
          <p className="rights-card-desc">
            Employers must ensure physical safety for electrical work, high scaffolding, and deep
            trench excavation.
          </p>
          <ul className="rights-bullets">
            <li>Site contractor must supply safety harnesses for height work.</li>
            <li>Electrical main breaker must be locked out during rewiring.</li>
            <li>Clean drinking water and basic first aid must be available on site.</li>
          </ul>
        </article>

        <article className="rights-info-card">
          <div className="rights-card-header">
            <span className="rights-num-badge">04</span>
            <div className="rights-icon-wrap icon-purple">
              <Scale size={20} />
            </div>
          </div>
          <h3 className="rights-card-title">What to Do If Payment Is Delayed</h3>
          <p className="rights-card-desc">
            If an employer avoids payment or disputes the agreed amount, follow these step-by-step
            remedies:
          </p>
          <ol className="rights-ordered-list">
            <li>
              <strong>Document details:</strong> Date, hours worked, site address, and employer phone.
            </li>
            <li>
              <strong>Send written message:</strong> Send a polite SMS or WhatsApp with agreed amount.
            </li>
            <li>
              <strong>File Grievance:</strong> Lodge a complaint via the Ministry of Labour Samadhan Portal.
            </li>
          </ol>
        </article>
      </div>

      {/* Official Government Helplines */}
      <section className="helpline-directory-section">
        <h3 className="section-sub-title">Official Government Helplines & Portals</h3>
        <div className="helplines-grid">
          <a
            href="tel:14434"
            className="helpline-card"
            title="Call Shram Suvidha Helpline"
          >
            <div className="helpline-icon-box">
              <PhoneCall size={22} />
            </div>
            <div className="helpline-text">
              <strong className="helpline-number">14434 (Toll-Free)</strong>
              <span className="helpline-label">Shram Suvidha National Labour Helpline</span>
              <small className="helpline-hours">Available 24/7 across India</small>
            </div>
          </a>

          <a
            href="https://samadhan.labour.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="helpline-card"
          >
            <div className="helpline-icon-box">
              <ExternalLink size={22} />
            </div>
            <div className="helpline-text">
              <strong className="helpline-number">Samadhan Portal</strong>
              <span className="helpline-label">Ministry of Labour Grievance Redressal</span>
              <small className="helpline-hours">File unpaid wage dispute online</small>
            </div>
          </a>

          <a
            href="https://labour.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="helpline-card"
          >
            <div className="helpline-icon-box">
              <FileText size={22} />
            </div>
            <div className="helpline-text">
              <strong className="helpline-number">Ministry of Labour</strong>
              <span className="helpline-label">Government of India Official Portal</span>
              <small className="helpline-hours">Welfare schemes & worker registration</small>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
