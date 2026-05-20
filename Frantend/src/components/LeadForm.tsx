import { useState } from 'react';
import type { LeadFormData, LeadStatus, LeadSource } from '../types';

interface Props {
  initial?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  loading: boolean;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadForm = ({ initial, onSubmit, loading }: Props) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initial?.name || '',
    email: initial?.email || '',
    status: initial?.status || 'New',
    source: initial?.source || 'Website',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputClass = (field: keyof LeadFormData) =>
    `w-full bg-white/5 border ${errors[field] ? 'border-red-500' : 'border-white/10'} rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors`;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
        <input className={inputClass('name')} placeholder="Rahul Sharma" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
        <input className={inputClass('email')} placeholder="rahul@example.com" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
          <select className={inputClass('status')} value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Source</label>
          <select className={inputClass('source')} value={form.source}
            onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadSource }))}>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-2">
        {loading ? 'Saving...' : 'Save Lead'}
      </button>
    </div>
  );
};