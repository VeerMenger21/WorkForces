import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, HardHat, ShieldCheck, UserRound } from 'lucide-react';
import { useStore } from '../context';
import { Brand } from '../components/Brand';
import { primaryWorkers } from '../seedData';
import { LanguageToggle } from '../i18n';
import type { WorkspaceRole } from '../types';

export function SignIn() {
  const { role: routeRole } = useParams<{ role?: string }>();
  const role: WorkspaceRole | null = routeRole === 'worker' || routeRole === 'client' ? routeRole : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { worker, employers, currentEmployer, setWorker, setCurrentEmployer, setSession } = useStore();
  const [selectedWorkerId, setSelectedWorkerId] = useState(worker.id);
  const [selectedEmployerId, setSelectedEmployerId] = useState(currentEmployer.id);
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState(worker.phone.replace(/\D/g, '').slice(-10));
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    if (!role) {
      setErrors({ form: 'Choose a workspace before signing in.' });
      return;
    }
    const nextErrors: Record<string, string> = {};
    if (passcode.trim().length < 4) nextErrors.passcode = 'Enter a passcode with at least 4 characters.';
    else if (passcode.length > 128) nextErrors.passcode = 'Passcode must be 128 characters or fewer.';

    if (role === 'worker') {
      const normalizedContact = contact.replace(/\D/g, '');
      // Validate against the same canonical list used to render the select.
      // The public directory can be loaded from older localStorage data and must
      // not prevent signing in with a profile that is visibly selectable here.
      if (!primaryWorkers.some(person => person.id === selectedWorkerId)) {
        nextErrors.worker = 'Choose a worker profile from the list.';
      }
      if (!/^\d{10}$/.test(normalizedContact)) nextErrors.contact = 'Enter a valid 10-digit mobile number.';
    } else {
      if (!employers.some(person => person.id === selectedEmployerId)) nextErrors.employer = 'Choose a client account from the list.';
      if (clientName.trim().length < 2 || clientName.trim().length > 80) nextErrors.clientName = 'Enter your name (2 to 80 characters).';
      if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim())) nextErrors.email = 'Enter a valid work email address.';
    }
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    if (role === 'worker') {
      const signedInWorker = primaryWorkers.find(person => person.id === selectedWorkerId) || worker;
      setWorker(signedInWorker);
      setSession({
        role,
        userId: signedInWorker.id,
        name: signedInWorker.name,
        contact: contact.replace(/\D/g, ''),
        signedInAt: new Date().toISOString()
      });
      const requestedPath = (location.state as { from?: string } | null)?.from;
      navigate(requestedPath?.startsWith('/worker') ? requestedPath : '/worker');
      return;
    }

    const selectedEmployer = employers.find(person => person.id === selectedEmployerId) || currentEmployer;
    const signedInEmployer = { ...selectedEmployer, name: clientName.trim() };
    setCurrentEmployer(signedInEmployer);
    setSession({
      role,
      userId: signedInEmployer.id,
        name: clientName.trim(),
      contact: email.trim(),
      signedInAt: new Date().toISOString()
    });
    const requestedPath = (location.state as { from?: string } | null)?.from;
    navigate(requestedPath?.startsWith('/employer') ? requestedPath : '/employer/workers');
  };

  return (
    <main className="signin-page">
      <header className="signin-topbar">
        <Brand />
        <div className="signin-top-actions">
          <LanguageToggle />
          <Link to="/" className="signin-back-link"><ArrowLeft size={15} /> Back to home</Link>
        </div>
      </header>

      <section className="signin-content">
        <div className="signin-intro">
          <span className="signin-kicker"><ShieldCheck size={14} /> ONE NETWORK, TWO WORKSPACES</span>
          <h1>Good work starts<br />with a <em>connection.</em></h1>
          <p>Sign in to find fair work or connect with available local tradespeople.</p>
          <div className="signin-trust-row">
            <span><CheckCircle2 size={15} /> Clear job terms</span>
            <span><CheckCircle2 size={15} /> Local, verified profiles</span>
          </div>
        </div>

        <div className="signin-card">
          {!role ? (
            <>
              <div className="signin-card-heading">
                <span className="signin-step">WELCOME</span>
                <h2>Choose your workspace</h2>
                <p>We’ll take you to the right sign-in.</p>
              </div>
              <div className="signin-role-options">
                <Link to="/signin/worker" className="signin-role-card">
                  <span className="signin-role-icon worker-role-icon"><HardHat size={20} /></span>
                  <span><strong>Worker workspace</strong><small>Find work and track your jobs</small></span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/signin/client" className="signin-role-card">
                  <span className="signin-role-icon client-role-icon"><BriefcaseBusiness size={19} /></span>
                  <span><strong>Client workspace</strong><small>Find and select available workers</small></span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="signin-card-heading">
                <span className="signin-step">{role === 'worker' ? 'WORKER SIGN IN' : 'CLIENT SIGN IN'}</span>
                <h2>{role === 'worker' ? 'Welcome back, worker' : 'Welcome to your client desk'}</h2>
                <p>{role === 'worker' ? 'Sign in to manage availability and work.' : 'Sign in to find available workers and manage jobs.'}</p>
              </div>

              <form className="signin-form" onSubmit={handleSubmit} noValidate>
                {role === 'worker' ? (
                  <>
                    <label className="signin-field">
                      <span>Worker profile</span>
                      <select aria-invalid={Boolean(errors.worker)} value={selectedWorkerId} onChange={event => {
                        const nextWorkerId = event.target.value;
                        setSelectedWorkerId(nextWorkerId);
                        setErrors(prev => ({ ...prev, worker: '' }));
                        const nextWorker = primaryWorkers.find(person => person.id === nextWorkerId);
                        if (nextWorker) setContact(nextWorker.phone.replace(/\D/g, '').slice(-10));
                      }}>
                        {primaryWorkers.map(person => (
                          <option key={person.id} value={person.id}>{person.name} · {person.trade}</option>
                        ))}
                      </select>
                      {errors.worker && <span className="field-error-msg">{errors.worker}</span>}
                    </label>
                    <label className="signin-field">
                      <span>Mobile number</span>
                      <input type="tel" inputMode="numeric" autoComplete="tel-national" value={contact} onChange={event => {
                        setContact(event.target.value);
                        setErrors(prev => ({ ...prev, contact: '' }));
                      }} placeholder="10-digit mobile number" maxLength={16} required aria-invalid={Boolean(errors.contact)} />
                      {errors.contact && <span className="field-error-msg">{errors.contact}</span>}
                    </label>
                  </>
                ) : (
                  <>
                    <label className="signin-field">
                      <span>Client account</span>
                      <select aria-invalid={Boolean(errors.employer)} value={selectedEmployerId} onChange={event => {
                        setSelectedEmployerId(event.target.value);
                        setErrors(prev => ({ ...prev, employer: '' }));
                      }}>
                        {employers.map(person => (
                          <option key={person.id} value={person.id}>{person.company || person.name}</option>
                        ))}
                      </select>
                      {errors.employer && <span className="field-error-msg">{errors.employer}</span>}
                    </label>
                    <label className="signin-field">
                      <span>Your full name</span>
                      <input type="text" autoComplete="name" value={clientName} onChange={event => {
                        setClientName(event.target.value);
                        setErrors(prev => ({ ...prev, clientName: '' }));
                      }} placeholder="Enter your name" required minLength={2} maxLength={80} aria-invalid={Boolean(errors.clientName)} />
                      {errors.clientName && <span className="field-error-msg">{errors.clientName}</span>}
                    </label>
                    <label className="signin-field">
                      <span>Work email</span>
                      <input type="email" autoComplete="email" value={email} onChange={event => {
                        setEmail(event.target.value);
                        setErrors(prev => ({ ...prev, email: '' }));
                      }} placeholder="you@company.com" required maxLength={254} aria-invalid={Boolean(errors.email)} />
                      {errors.email && <span className="field-error-msg">{errors.email}</span>}
                    </label>
                  </>
                )}

                <label className="signin-field">
                  <span>Passcode</span>
                  <input type="password" autoComplete="current-password" value={passcode} onChange={event => {
                    setPasscode(event.target.value);
                    setErrors(prev => ({ ...prev, passcode: '' }));
                  }} placeholder="At least 4 characters" required minLength={4} maxLength={128} aria-invalid={Boolean(errors.passcode)} />
                  {errors.passcode && <span className="field-error-msg">{errors.passcode}</span>}
                </label>

                {errors.form && <p className="signin-error" role="alert">{errors.form}</p>}
                <button className="btn-primary-large signin-submit" type="submit">
                  <UserRound size={17} /> Sign in to {role === 'worker' ? 'worker' : 'client'} workspace <ArrowRight size={16} />
                </button>
              </form>

              <p className="signin-demo-note">Demo sign-in is stored on this device. No account details are sent to a server.</p>
              <div className="signin-switch-role">
                {role === 'worker' ? 'Hiring workers instead?' : 'Looking for work instead?'}{' '}
                <Link to={role === 'worker' ? '/signin/client' : '/signin/worker'}>
                  Switch to {role === 'worker' ? 'client' : 'worker'} sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
