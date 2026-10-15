export type EmploymentType = 'daily' | 'contract' | 'weekly' | 'monthly' | 'long_term';
export type WageUnit = 'day' | 'week' | 'month' | 'total';

export type Worker = {
  id: string;
  name: string;
  trade: string;
  skills: string[];
  experience: string;
  aboutMe: string; // Renamed from intro
  workExperience: string; // Renamed from sample
  area: string;
  city: 'Mumbai' | 'Navi Mumbai';
  neighborhood: string;
  available: boolean;
  photo: string;
  phone: string;
  dailyRate?: number;
  rating: number;
  reviewCount: number;
  completedJobs?: number;
  verified?: boolean;
  // Legacy compatibility fields
  intro?: string;
  sample?: string;
};

export type Employer = {
  id: string;
  name: string;
  company?: string;
  type: 'homeowner' | 'contractor' | 'business' | 'housing_society';
  area: string;
  city: 'Mumbai' | 'Navi Mumbai';
  neighborhood: string;
  phone: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  photo?: string;
};

export type Job = {
  id: string;
  title: string;
  trade: string;
  compatibleTrades?: string[];
  requiredSkills?: string[];
  employerId: string;
  employer: string;
  employerPhone?: string;
  verified: boolean;
  description: string;
  employmentType: EmploymentType;
  wage: number;
  wageUnit: WageUnit;
  area: string;
  city: 'Mumbai' | 'Navi Mumbai';
  neighborhood: string;
  siteAddress?: string;
  distance: string;
  hours: string;
  duration: string;
  payment: string;
  tools: string;
  safetyGear?: string;
  date: string;
  startDate?: string;
  status: 'open' | 'confirmed' | 'completed' | 'cancelled';
  paymentDisputed?: boolean;
  paymentStatus?: 'pending' | 'paid' | 'disputed';
  workerId?: string;
  workersNeeded?: number;
  interested: number;
  cancellationReason?: string;
  cancelledBy?: 'worker' | 'employer';
  cancelledAt?: string;
  createdAt?: string;
};

export type DisputeRecord = {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  employerId: string;
  employerName: string;
  amount: number;
  wageUnit: WageUnit;
  reason: string;
  description?: string;
  createdAt: string;
  status: 'under_review' | 'acknowledged' | 'resolved';
  resolutionNotes?: string;
};

export type InAppNotification = {
  id: string;
  recipientType: 'employer' | 'worker';
  recipientId: string;
  title: string;
  message: string;
  type: 'dispute' | 'dispute_acknowledged' | 'dispute_resolved' | 'rating' | 'hire' | 'completion' | 'cancellation';
  referenceId: string;
  createdAt: string;
  read: boolean;
  disputeData?: {
    jobTitle: string;
    workerName: string;
    reason: string;
    amount: number;
  };
};

export type RatingRecord = {
  id: string;
  jobId: string;
  jobTitle: string;
  reviewerType: 'worker' | 'employer';
  reviewerId: string;
  reviewerName: string;
  recipientType: 'worker' | 'employer';
  recipientId: string;
  recipientName: string;
  rating: number; // 1 to 5
  categories: string[];
  comment?: string;
  createdAt: string;
};

export type LocationInfo = {
  city: 'Mumbai' | 'Navi Mumbai';
  neighborhood: string;
  displayName: string;
};

export type WorkspaceRole = 'worker' | 'client';

export type AuthSession = {
  role: WorkspaceRole;
  userId: string;
  name: string;
  contact: string;
  signedInAt: string;
};

export type ToastMessage = {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
};

export type Store = {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  signOut: () => void;
  worker: Worker;
  setWorker: (w: Worker | ((prev: Worker) => Worker)) => void;
  switchWorker: (workerId: string) => void;
  workers: Worker[];
  setWorkers: (workers: Worker[] | ((prev: Worker[]) => Worker[])) => void;
  currentEmployer: Employer;
  setCurrentEmployer: (e: Employer | ((prev: Employer) => Employer)) => void;
  employers: Employer[];
  setEmployers: (employers: Employer[] | ((prev: Employer[]) => Employer[])) => void;
  jobs: Job[];
  setJobs: (j: Job[] | ((prev: Job[]) => Job[])) => void;
  savedJobIds: string[];
  setSavedJobIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  toggleSaveJob: (id: string) => void;
  cancelJob: (jobId: string, reason: string, cancelledBy: 'worker' | 'employer') => void;
  disputes: DisputeRecord[];
  submitDispute: (data: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => void;
  acknowledgeDispute: (disputeId: string) => void;
  resolveDispute: (disputeId: string, notes?: string) => void;
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: (recipientId: string) => void;
  ratings: RatingRecord[];
  submitRating: (data: Omit<RatingRecord, 'id' | 'createdAt'>) => void;
  getRatingsForRecipient: (recipientId: string) => RatingRecord[];
  getRatingSummary: (recipientId: string, baseRating?: number, baseCount?: number) => { rating: number; count: number };
  hasUserRatedJob: (jobId: string, reviewerId: string) => boolean;
  toasts: ToastMessage[];
  addToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
};
