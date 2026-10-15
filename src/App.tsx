import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Provider } from './context';
import { ToastContainer } from './components/Toast';

// Landing
import { Landing } from './pages/Landing';

// Worker Portal
import { WorkerShell } from './pages/worker/WorkerShell';
import { WorkerHome } from './pages/worker/WorkerHome';
import { Jobs } from './pages/worker/Jobs';
import { JobDetail } from './pages/worker/JobDetail';
import { Diary } from './pages/worker/Diary';
import { Profile } from './pages/worker/Profile';
import { Rights } from './pages/worker/Rights';

// Employer Portal
import { EmployerShell } from './pages/employer/EmployerShell';
import { Dashboard } from './pages/employer/Dashboard';
import { Discover } from './pages/employer/Discover';
import { PostJob } from './pages/employer/PostJob';
import { ManageJobs } from './pages/employer/ManageJobs';
import { SignIn } from './pages/SignIn';
import { useStore } from './context';
import { LanguageProvider } from './i18n';

function WorkspaceGate({ role, children }: { role: 'worker' | 'client'; children: ReactNode }) {
  const { session } = useStore();
  const location = useLocation();

  if (!session || session.role !== role) {
    return <Navigate to={`/signin/${role}`} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <Provider>
      <LanguageProvider>
        <ToastContainer />
        <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signin/:role" element={<SignIn />} />

        {/* Worker Portal Routes */}
        <Route path="/worker" element={<WorkspaceGate role="worker"><WorkerShell /></WorkspaceGate>}>
          <Route index element={<WorkerHome />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="diary" element={<Diary />} />
          <Route path="profile" element={<Profile />} />
          <Route path="rights" element={<Rights />} />
        </Route>

        {/* Employer Portal Routes */}
        <Route path="/employer" element={<WorkspaceGate role="client"><EmployerShell /></WorkspaceGate>}>
          <Route index element={<Dashboard />} />
          <Route path="workers" element={<Discover />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs" element={<ManageJobs />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Landing />} />
        </Routes>
      </LanguageProvider>
    </Provider>
  );
}

export default App;
