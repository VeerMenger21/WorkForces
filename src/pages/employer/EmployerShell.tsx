import { Outlet, NavLink } from 'react-router-dom';
import { useStore } from '../../context';
import { ModeBar } from '../../components/ModeBar';
import {
  Compass,
  Users,
  BriefcaseBusiness,
  PlusCircle,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function EmployerShell() {
  const { currentEmployer } = useStore();
  const employerTypeLabel = currentEmployer.type.replace('_', ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

  return (
    <div className="employer-app-shell">
        <ModeBar mode="employer" />

        <div className="employer-body-layout">
          {/* Desktop Sidebar */}
          <aside className="employer-sidebar" aria-label="Employer navigation">
            <div className="employer-company-lockup">
              <div className="company-logo-avatar">
                <Building2 size={20} />
              </div>
              <div className="company-title-wrap">
                <div className="company-name-row">
                  <h4 className="company-name">{currentEmployer.company || currentEmployer.name}</h4>
                  {currentEmployer.verified && (
                    <span title={`Verified ${employerTypeLabel}`}>
                      <CheckCircle2 size={14} className="verified-check" />
                    </span>
                  )}
                </div>
                <span className="company-sub">{currentEmployer.name} · {employerTypeLabel}</span>
              </div>
            </div>

            <nav className="employer-nav-menu">
              <NavLink end to="/employer" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <Compass size={18} />
                <span>{"Overview"}</span>
              </NavLink>

              <NavLink to="/employer/workers" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <Users size={18} />
                <span>{"Find Workers (Naka)"}</span>
              </NavLink>

              <NavLink to="/employer/jobs" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <BriefcaseBusiness size={18} />
                <span>{"Manage Jobs"}</span>
              </NavLink>

              <NavLink to="/employer/post-job" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <PlusCircle size={18} />
                <span>{"Post a Job"}</span>
              </NavLink>
            </nav>

            {/* Sidebar Tip Card */}
            <div className="sidebar-promo-card employer-promo">
              <div className="promo-top">
                <span className="promo-badge">
                  <Sparkles size={13} /> CLEAR TERMS
                </span>
              </div>
              <h5 className="promo-title">Good hires start with clarity.</h5>
              <p className="promo-desc">
                Clear pay rates, fixed working hours, and fair tool arrangements attract the most skilled local workers.
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="employer-main-content">
            <Outlet />
          </main>
        </div>

    </div>
  );
}
