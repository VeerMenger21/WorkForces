import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  Worker,
  Employer,
  Job,
  DisputeRecord,
  InAppNotification,
  RatingRecord,
  AuthSession,
  Store,
  ToastMessage
} from './types';
import {
  seedWorker,
  seedWorkers,
  seedEmployers,
  seedJobs,
  seedDisputes,
  seedNotifications,
  seedRatings
} from './seedData';

const Ctx = createContext<Store | null>(null);

function mergeActiveWorker(workers: Worker[], activeWorker: Worker): Worker[] {
  let found = false;
  const merged = workers.map(profile => {
    if (profile.id !== activeWorker.id) return profile;
    found = true;
    return { ...profile, ...activeWorker };
  });

  return found ? merged : [...merged, activeWorker];
}

export function useStore(): Store {
  const context = useContext(Ctx);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export function Provider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('ks-auth-session');
      return saved ? JSON.parse(saved) as AuthSession : null;
    } catch {
      return null;
    }
  });

  const setSession = (nextSession: AuthSession) => setSessionState(nextSession);
  const signOut = () => setSessionState(null);

  // 1. Worker Profile
  const [worker, setWorkerState] = useState<Worker>(() => {
    try {
      const saved = localStorage.getItem('ks-worker');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate legacy fields safely
        if (!parsed.aboutMe && parsed.intro) parsed.aboutMe = parsed.intro;
        if (!parsed.workExperience && parsed.sample) parsed.workExperience = parsed.sample;
        return { ...seedWorker, ...parsed };
      }
      return seedWorker;
    } catch {
      return seedWorker;
    }
  });

  // 2. All Workers
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem('ks-all-workers-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) return mergeActiveWorker(parsed, worker);
      }
      return mergeActiveWorker(seedWorkers, worker);
    } catch {
      return mergeActiveWorker(seedWorkers, worker);
    }
  });

  // Keep the active worker's public directory record in sync with their profile
  // and availability so employer views never rely on stale availability data.
  const setWorker = (nextWorker: Worker | ((prev: Worker) => Worker)) => {
    const updatedWorker = typeof nextWorker === 'function' ? nextWorker(worker) : nextWorker;
    setWorkerState(updatedWorker);
    setWorkers(prev => mergeActiveWorker(prev, updatedWorker));
  };

  // 3. Current Employer (Active in Employer Portal)
  const [currentEmployer, setCurrentEmployer] = useState<Employer>(() => {
    try {
      const saved = localStorage.getItem('ks-current-employer');
      return saved ? JSON.parse(saved) : seedEmployers[0];
    } catch {
      return seedEmployers[0];
    }
  });

  // 4. All Employers
  const [employers, setEmployers] = useState<Employer[]>(() => {
    try {
      const saved = localStorage.getItem('ks-employers');
      return saved ? JSON.parse(saved) : seedEmployers;
    } catch {
      return seedEmployers;
    }
  });

  // 5. Jobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('ks-jobs-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      }
      return seedJobs;
    } catch {
      return seedJobs;
    }
  });

  // 6. Saved Job IDs
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ks-saved-jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 7. Disputes
  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ks-disputes');
      return saved ? JSON.parse(saved) : seedDisputes;
    } catch {
      return seedDisputes;
    }
  });

  // 8. In-App Notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ks-notifications');
      return saved ? JSON.parse(saved) : seedNotifications;
    } catch {
      return seedNotifications;
    }
  });

  // 9. Ratings & Reviews
  const [ratings, setRatings] = useState<RatingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ks-ratings');
      return saved ? JSON.parse(saved) : seedRatings;
    } catch {
      return seedRatings;
    }
  });

  // 11. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleSaveJob = (id: string) => {
    setSavedJobIds(prev => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        addToast('Job removed from saved bookmarks', 'info');
        return prev.filter(item => item !== id);
      } else {
        addToast('Job saved! Find it in your Saved tab', 'success');
        return [...prev, id];
      }
    });
  };

  // Submit a formal dispute
  const submitDispute = (data: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => {
    // Check if an active dispute already exists for this job to prevent duplicates
    const existing = disputes.find(d => d.jobId === data.jobId && d.status !== 'resolved');
    if (existing) {
      addToast('A dispute for this job is already under review.', 'warning');
      return;
    }

    const newDispute: DisputeRecord = {
      ...data,
      id: `disp-${Date.now()}`,
      createdAt: 'Just now',
      status: 'under_review'
    };

    setDisputes(prev => [newDispute, ...prev]);

    // Update job payment status to disputed
    setJobs(prev =>
      prev.map(j =>
        j.id === data.jobId
          ? {
              ...j,
              paymentStatus: 'disputed',
              paymentDisputed: true
            }
          : j
      )
    );

    // Create in-app alert for the employer
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      recipientType: 'employer',
      recipientId: data.employerId,
      title: `Payment Dispute Alert: ${data.jobTitle}`,
      message: `${data.workerName} reported: "${data.reason}". Please review terms and acknowledge.`,
      type: 'dispute',
      referenceId: newDispute.id,
      createdAt: 'Just now',
      read: false,
      disputeData: {
        jobTitle: data.jobTitle,
        workerName: data.workerName,
        reason: data.reason,
        amount: data.amount
      }
    };

    setNotifications(prev => [newNotif, ...prev]);
    addToast('Dispute submitted. Status is now Under Review. The employer has been alerted.', 'success');
  };

  // Employer acknowledges dispute
  const acknowledgeDispute = (disputeId: string) => {
    let disputedJobTitle = '';
    let targetWorkerId = '';

    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          disputedJobTitle = d.jobTitle;
          targetWorkerId = d.workerId;
          return { ...d, status: 'acknowledged' };
        }
        return d;
      })
    );

    if (targetWorkerId) {
      const workerNotif: InAppNotification = {
        id: `notif-${Date.now()}`,
        recipientType: 'worker',
        recipientId: targetWorkerId,
        title: 'Dispute Acknowledged by Employer',
        message: `Employer acknowledged your dispute for "${disputedJobTitle}". Settlement is in progress.`,
        type: 'dispute_acknowledged',
        referenceId: disputeId,
        createdAt: 'Just now',
        read: false
      };
      setNotifications(prev => [workerNotif, ...prev]);
    }

    addToast('Dispute acknowledged. Worker notification sent.', 'info');
  };

  // Resolve dispute and mark job paid
  const resolveDispute = (disputeId: string, notes?: string) => {
    let resolvedJobId = '';
    let targetWorkerId = '';
    let disputedJobTitle = '';

    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          resolvedJobId = d.jobId;
          targetWorkerId = d.workerId;
          disputedJobTitle = d.jobTitle;
          return {
            ...d,
            status: 'resolved',
            resolutionNotes: notes || 'Payment settled in full.'
          };
        }
        return d;
      })
    );

    if (resolvedJobId) {
      setJobs(prev =>
        prev.map(j =>
          j.id === resolvedJobId
            ? {
                ...j,
                paymentStatus: 'paid',
                paymentDisputed: false
              }
            : j
        )
      );
    }

    if (targetWorkerId) {
      const workerNotif: InAppNotification = {
        id: `notif-${Date.now()}`,
        recipientType: 'worker',
        recipientId: targetWorkerId,
        title: 'Payment Dispute Resolved!',
        message: `The payment dispute for "${disputedJobTitle}" has been resolved and recorded as Paid.`,
        type: 'dispute_resolved',
        referenceId: disputeId,
        createdAt: 'Just now',
        read: false
      };
      setNotifications(prev => [workerNotif, ...prev]);
    }

    addToast('Dispute resolved! Work recorded as Paid.', 'success');
  };

  // Submit Rating & Review
  const submitRating = (data: Omit<RatingRecord, 'id' | 'createdAt'>) => {
    const existing = ratings.find(
      r => r.jobId === data.jobId && r.reviewerId === data.reviewerId
    );

    if (existing) {
      addToast('You have already submitted a review for this job.', 'warning');
      return;
    }

    const newRating: RatingRecord = {
      ...data,
      id: `rate-${Date.now()}`,
      createdAt: 'Just now'
    };

    setRatings(prev => [newRating, ...prev]);

    // Send notification to recipient
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      recipientType: data.recipientType,
      recipientId: data.recipientId,
      title: `New ${data.rating}★ Review Received!`,
      message: `${data.reviewerName} left feedback for "${data.jobTitle}".`,
      type: 'rating',
      referenceId: newRating.id,
      createdAt: 'Just now',
      read: false
    };

    setNotifications(prev => [notif, ...prev]);
    addToast('Thank you! Your feedback has been recorded.', 'success');
  };

  const hasUserRatedJob = (jobId: string, reviewerId: string): boolean => {
    return ratings.some(r => r.jobId === jobId && r.reviewerId === reviewerId);
  };

  const getRatingsForRecipient = (recipientId: string): RatingRecord[] => {
    return ratings.filter(r => r.recipientId === recipientId);
  };

  const getRatingSummary = (
    recipientId: string,
    baseRating: number = 4.8,
    baseCount: number = 10
  ): { rating: number; count: number } => {
    const userRatings = ratings.filter(r => r.recipientId === recipientId);
    if (userRatings.length === 0) {
      return { rating: baseRating, count: baseCount };
    }
    const totalScore = userRatings.reduce((sum, r) => sum + r.rating, 0) + (baseRating * baseCount);
    const totalCount = userRatings.length + baseCount;
    return {
      rating: Number((totalScore / totalCount).toFixed(1)),
      count: totalCount
    };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = (recipientId: string) => {
    setNotifications(prev => prev.filter(n => n.recipientId !== recipientId));
    addToast('Notifications cleared.', 'info');
  };

  const switchWorker = (workerId: string) => {
    const target = workers.find(w => w.id === workerId);
    if (target) {
      setWorker(target);
      addToast(`Switched active worker profile to ${target.name} (${target.trade})`, 'info');
    }
  };

  const cancelJob = (jobId: string, reason: string, cancelledBy: 'worker' | 'employer') => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    if (cancelledBy === 'worker') {
      // Worker cancels assignment: reopen job so employer can reassign
      setJobs(prev =>
        prev.map(j =>
          j.id === jobId
            ? {
                ...j,
                status: 'open',
                workerId: undefined,
                cancellationReason: reason,
                cancelledBy: 'worker',
                cancelledAt: 'Just now'
              }
            : j
        )
      );

      // Notify the employer
      const empNotif: InAppNotification = {
        id: `notif-${Date.now()}`,
        recipientType: 'employer',
        recipientId: targetJob.employerId || 'emp-greenview',
        title: `Booking Cancelled by ${worker.name}`,
        message: `${worker.name} withdrew from "${targetJob.title}". Reason: ${reason}. Your job listing has been reopened for other workers.`,
        type: 'cancellation',
        referenceId: jobId,
        createdAt: 'Just now',
        read: false
      };
      setNotifications(prev => [empNotif, ...prev]);
      addToast(`Task booking cancelled. Employer notified.`, 'info');
    } else {
      // Employer cancels the job
      setJobs(prev =>
        prev.map(j =>
          j.id === jobId
            ? {
                ...j,
                status: 'cancelled',
                cancellationReason: reason,
                cancelledBy: 'employer',
                cancelledAt: 'Just now'
              }
            : j
        )
      );

      // If a worker was assigned, notify them
      if (targetJob.workerId) {
        const workerNotif: InAppNotification = {
          id: `notif-${Date.now()}`,
          recipientType: 'worker',
          recipientId: targetJob.workerId,
          title: `Job Cancelled by Employer`,
          message: `${targetJob.employer} has cancelled "${targetJob.title}". Reason: ${reason}.`,
          type: 'cancellation',
          referenceId: jobId,
          createdAt: 'Just now',
          read: false
        };
        setNotifications(prev => [workerNotif, ...prev]);
      }
      addToast(`Job "${targetJob.title}" has been cancelled.`, 'info');
    }
  };

  const resetDemoData = () => {
    signOut();
    setWorker(seedWorker);
    setWorkers(seedWorkers);
    setCurrentEmployer(seedEmployers[0]);
    setEmployers(seedEmployers);
    setJobs(seedJobs);
    setSavedJobIds([]);
    setDisputes(seedDisputes);
    setNotifications(seedNotifications);
    setRatings(seedRatings);
    try {
      localStorage.removeItem('ks-worker');
      localStorage.removeItem('ks-all-workers-v2');
      localStorage.removeItem('ks-current-employer');
      localStorage.removeItem('ks-employers');
      localStorage.removeItem('ks-jobs-v2');
      localStorage.removeItem('ks-saved-jobs');
      localStorage.removeItem('ks-disputes');
      localStorage.removeItem('ks-notifications');
      localStorage.removeItem('ks-ratings');
    } catch (e) {
      console.warn('Storage clear error', e);
    }
    addToast('Demo dataset reset to fresh defaults!', 'success');
  };

  // LocalStorage synchronizations
  useEffect(() => {
    try {
      if (session) localStorage.setItem('ks-auth-session', JSON.stringify(session));
      else localStorage.removeItem('ks-auth-session');
    } catch {}
  }, [session]);

  useEffect(() => {
    try { localStorage.setItem('ks-worker', JSON.stringify(worker)); } catch {}
  }, [worker]);

  useEffect(() => {
    try { localStorage.setItem('ks-all-workers-v2', JSON.stringify(workers)); } catch {}
  }, [workers]);

  useEffect(() => {
    try { localStorage.setItem('ks-current-employer', JSON.stringify(currentEmployer)); } catch {}
  }, [currentEmployer]);

  useEffect(() => {
    try { localStorage.setItem('ks-employers', JSON.stringify(employers)); } catch {}
  }, [employers]);

  useEffect(() => {
    try { localStorage.setItem('ks-jobs-v2', JSON.stringify(jobs)); } catch {}
  }, [jobs]);

  useEffect(() => {
    try { localStorage.setItem('ks-saved-jobs', JSON.stringify(savedJobIds)); } catch {}
  }, [savedJobIds]);

  useEffect(() => {
    try { localStorage.setItem('ks-disputes', JSON.stringify(disputes)); } catch {}
  }, [disputes]);

  useEffect(() => {
    try { localStorage.setItem('ks-notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('ks-ratings', JSON.stringify(ratings)); } catch {}
  }, [ratings]);



  return (
    <Ctx.Provider
      value={{
        session,
        setSession,
        signOut,
        worker,
        setWorker,
        switchWorker,
        workers,
        setWorkers,
        currentEmployer,
        setCurrentEmployer,
        employers,
        setEmployers,
        jobs,
        setJobs,
        savedJobIds,
        setSavedJobIds,
        toggleSaveJob,
        cancelJob,
        disputes,
        submitDispute,
        acknowledgeDispute,
        resolveDispute,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        ratings,
        submitRating,
        getRatingsForRecipient,
        getRatingSummary,
        hasUserRatedJob,
        toasts,
        addToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
