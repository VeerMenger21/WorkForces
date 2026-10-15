import { Worker, Job, EmploymentType, WageUnit } from '../types';

/**
 * Normalizes trade names to canonical keys for robust matching.
 */
export function normalizeTrade(trade: string): string {
  const t = trade.toLowerCase().trim();
  if (t.includes('electr')) return 'electrician';
  if (t.includes('plumb')) return 'plumber';
  if (t.includes('paint')) return 'painter';
  if (t.includes('carpent')) return 'carpenter';
  if (t.includes('weld') || t.includes('fabricat')) return 'welder';
  if (t.includes('mason') || t.includes('brick')) return 'mason';
  if (t.includes('construct') || t.includes('labour') || t.includes('labor')) return 'construction';
  if (t.includes('sanitat') || t.includes('clean') || t.includes('housekeep')) return 'sanitation';
  if (t.includes('help')) return 'helper';
  return t;
}

/**
 * Strict Trade Matching check.
 * Workers only see jobs that match their skills and trade.
 * - Electricians see electrical work only.
 * - Plumbers see plumbing work only.
 * - Carpenters see carpentry/woodwork.
 * - Painters see painting work.
 * - Workers with multiple explicit skills can match those additional skills.
 */
export function isWorkerMatchingJob(worker: Worker, job: Job): boolean {
  const workerTradeKey = normalizeTrade(worker.trade);
  const jobTradeKey = normalizeTrade(job.trade);

  // 1. Direct primary trade match
  if (workerTradeKey === jobTradeKey) {
    return true;
  }

  // 2. Compatible trades match (e.g. Mason & Construction Labourer)
  if (job.compatibleTrades && job.compatibleTrades.length > 0) {
    const isCompatible = job.compatibleTrades.some(
      ct => normalizeTrade(ct) === workerTradeKey
    );
    if (isCompatible) return true;
  }

  // Overlap between Mason and Construction Worker
  if (
    (workerTradeKey === 'mason' && jobTradeKey === 'construction') ||
    (workerTradeKey === 'construction' && jobTradeKey === 'mason')
  ) {
    return true;
  }

  // 3. Worker explicit skills match
  if (worker.skills && worker.skills.length > 0) {
    const hasMatchingSkill = worker.skills.some(skill => {
      const normalizedSkill = normalizeTrade(skill);
      if (normalizedSkill === jobTradeKey) return true;
      if (skill.toLowerCase().includes(job.trade.toLowerCase())) return true;
      return false;
    });

    if (hasMatchingSkill) return true;
  }

  return false;
}

/**
 * Formats wage with correct period unit.
 */
export function formatWage(wage: number, unit: WageUnit = 'day'): string {
  const formattedAmount = `₹${wage.toLocaleString('en-IN')}`;
  switch (unit) {
    case 'week':
      return `${formattedAmount} / week`;
    case 'month':
      return `${formattedAmount} / month`;
    case 'total':
      return `${formattedAmount} total`;
    case 'day':
    default:
      return `${formattedAmount} / day`;
  }
}

/**
 * Returns human-friendly label for employment type.
 */
export function getEmploymentTypeLabel(type: EmploymentType = 'daily'): string {
  switch (type) {
    case 'contract':
      return 'Short-Term Contract';
    case 'weekly':
      return 'Weekly Work';
    case 'monthly':
      return 'Monthly Work';
    case 'long_term':
      return 'Long-Term / Ongoing';
    case 'daily':
    default:
      return 'Daily Work';
  }
}

/**
 * Returns CSS badge class for employment type.
 */
export function getEmploymentTypeBadgeClass(type: EmploymentType = 'daily'): string {
  switch (type) {
    case 'long_term':
      return 'pill-emp-longterm';
    case 'monthly':
      return 'pill-emp-monthly';
    case 'weekly':
      return 'pill-emp-weekly';
    case 'contract':
      return 'pill-emp-contract';
    case 'daily':
    default:
      return 'pill-emp-daily';
  }
}
