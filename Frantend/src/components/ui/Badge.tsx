import type { LeadStatus, LeadSource } from '../../types';

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  Contacted: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  Qualified: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  Lost: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
};

const sourceColors: Record<LeadSource, string> = {
  Website: 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30',
  Instagram: 'bg-pink-500/15 text-pink-400 ring-1 ring-pink-500/30',
  Referral: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
    {status}
  </span>
);

export const SourceBadge = ({ source }: { source: LeadSource }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColors[source]}`}>
    {source}
  </span>
);