import { Link } from 'react-router-dom';
import { useStore } from '../context';
import { Brand } from './Brand';
import { LanguageToggle } from '../i18n';
import {
  UserRound,
  BriefcaseBusiness,
  CheckCircle2,
  LogOut
} from 'lucide-react';

export function ModeBar({ mode }: { mode: 'worker' | 'employer' }) {
  const { worker, session, signOut, currentEmployer } = useStore();

  return (
    <header className="app-modebar">
      <div className="modebar-left">
        <Brand />
      </div>

      <nav className="mode-switch-group" aria-label="Portal selector">
        <Link
          to="/signin/worker"
          className={`mode-tab ${mode === 'worker' ? 'is-active' : ''}`}
        >
          <UserRound size={16} />
          <span>{"Worker"}</span>
          {worker.available && mode === 'worker' && (
            <span className="live-status-dot" title="Available today" />
          )}
        </Link>
        <Link
          to="/signin/client"
          className={`mode-tab ${mode === 'employer' ? 'is-active' : ''}`}
        >
          <BriefcaseBusiness size={16} />
          <span>Client</span>
        </Link>
      </nav>

      <div className="modebar-right">
        <LanguageToggle />
        {/* Quick User Avatar or Tag */}
        {mode === 'worker' ? (
          <Link
            to="/worker/profile"
            className="header-avatar-link"
            title={`${worker.name} Profile`}
          >
            <div className="avatar-chip">
              <span className="avatar-initials">{worker.photo}</span>
              <span
                className={`avatar-badge ${
                  worker.available ? 'badge-online' : 'badge-offline'
                }`}
              />
            </div>
          </Link>
        ) : (
          <div className="header-employer-chip">
            <span className="employer-badge-icon">
              <CheckCircle2 size={13} />
            </span>
            <span className="employer-chip-name">{currentEmployer.company || session?.name || 'Client workspace'}</span>
          </div>
        )}
        <Link to="/signin" className="workspace-signout" onClick={signOut} title="Sign out" aria-label="Sign out">
          <LogOut size={16} />
          <span>Sign out</span>
        </Link>
      </div>
    </header>
  );
}
