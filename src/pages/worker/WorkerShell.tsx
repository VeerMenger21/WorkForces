import { Outlet, NavLink } from 'react-router-dom';
import { useStore } from '../../context';
import { ModeBar } from '../../components/ModeBar';
import {
  Compass,
  Search,
  CalendarDays,
  UserRound,
  ShieldCheck,
  MapPin,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export function WorkerShell() {
  const { worker } = useStore();

  return (
    <div className="worker-app-shell">
        <ModeBar mode="worker" />

        <div className="worker-body-layout">
          {/* Desktop Sidebar */}
          <aside className="worker-sidebar" aria-label="Worker navigation">
            <div className="worker-profile-card-mini">
              <div className="avatar-large-box">
                <span className="avatar-text">{worker.photo}</span>
                {worker.available ? (
                  <span className="status-indicator-dot is-online" title="Available today" />
                ) : (
                  <span className="status-indicator-dot is-offline" title="Not marked available" />
                )}
              </div>
              <div className="worker-info-mini">
                <div className="worker-name-row">
                  <h4 className="worker-sidebar-name">{worker.name}</h4>
                  {worker.verified && (
                    <span title="Verified Worker">
                      <CheckCircle2 size={14} className="verified-check" />
                    </span>
                  )}
                </div>
                <p className="worker-trade-mini">
                  <Wrench size={13} /> {worker.trade} · {worker.experience}
                </p>
                <p className="worker-loc-mini">
                  <MapPin size={12} /> {worker.area.split(',')[0]}
                </p>
              </div>
            </div>

            <nav className="worker-nav-menu">
              <NavLink end to="/worker" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <Compass size={18} />
                <span>{"Home"}</span>
              </NavLink>

              <NavLink to="/worker/jobs" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <Search size={18} />
                <span>{"Find Work"}</span>
              </NavLink>

              <NavLink to="/worker/diary" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <CalendarDays size={18} />
                <span>{"My Diary"}</span>
              </NavLink>

              <NavLink to="/worker/profile" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <UserRound size={18} />
                <span>{"My Profile"}</span>
              </NavLink>

              <NavLink to="/worker/rights" className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}>
                <ShieldCheck size={18} />
                <span>{"Rights & Help"}</span>
              </NavLink>
            </nav>

          </aside>

          {/* Main Content Area */}
          <main className="worker-main-content">
            <Outlet />
          </main>
        </div>

    </div>
  );
}
