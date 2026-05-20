import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { StatusBadge, SourceBadge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/LeadForm';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { createLeadApi, updateLeadApi, deleteLeadApi, exportLeadsCSV } from '../api/leads';
import { useAuth } from '../context/AuthContext';
import type { Lead, LeadFormData, LeadFilters, LeadStatus, LeadSource } from '../types';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const filters: LeadFilters = {
    search: debouncedSearch || undefined,
    status: status || undefined,
    source: source || undefined,
    sort,
    page,
  };

  const { leads, pagination, loading, error, refetch } = useLeads(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleCreate = async (data: LeadFormData) => {
    setFormLoading(true);
    try {
      await createLeadApi(data);
      setCreateOpen(false);
      refetch();
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!editLead) return;
    setFormLoading(true);
    try {
      await updateLeadApi(editLead._id, data);
      setEditLead(null);
      refetch();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteLead) return;
    setFormLoading(true);
    try {
      await deleteLeadApi(deleteLead._id);
      setDeleteLead(null);
      refetch();
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await exportLeadsCSV(filters);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch(''); setStatus(''); setSource(''); setSort('latest'); setPage(1);
  };

  const hasFilters = search || status || source || sort !== 'latest';

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Leads</h1>
            <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total leads</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors disabled:opacity-50">
              {exportLoading ? <Spinner size="sm" /> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Export CSV
            </button>
            {isAdmin && (
              <button onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Lead
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={status} onChange={e => { setStatus(e.target.value as LeadStatus | ''); setPage(1); }}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={source} onChange={e => { setSource(e.target.value as LeadSource | ''); setPage(1); }}>
              <option value="">All Sources</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={sort} onChange={e => { setSort(e.target.value as 'latest' | 'oldest'); setPage(1); }}>
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5">
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-400 font-medium">Failed to load leads</p>
              <button onClick={refetch} className="mt-3 text-sm text-indigo-400 hover:text-indigo-300">Try again</button>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 font-medium">No leads found</p>
              <p className="text-gray-600 text-sm mt-1">
                {hasFilters ? 'Try adjusting your filters' : 'Add your first lead to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Source</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Created</th>
                    {isAdmin && <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{lead.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-400">{lead.email}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                      <td className="px-5 py-3.5"><SourceBadge source={lead.source} /></td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditLead(lead)}
                              className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-500/10">Edit</button>
                            <button onClick={() => setDeleteLead(lead)}
                              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10">Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/10">Prev</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg ${p === page ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/10">Next</button>
            </div>
          </div>
        )}
      </main>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add New Lead">
        <LeadForm onSubmit={handleCreate} loading={formLoading} />
      </Modal>
      <Modal open={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && <LeadForm initial={editLead} onSubmit={handleUpdate} loading={formLoading} />}
      </Modal>
      <Modal open={!!deleteLead} onClose={() => setDeleteLead(null)} title="Delete Lead">
        <p className="text-gray-400 text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-medium">{deleteLead?.name}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteLead(null)} className="flex-1 py-2.5 text-sm border border-white/10 rounded-xl hover:bg-white/5">Cancel</button>
          <button onClick={handleDelete} disabled={formLoading} className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-500 rounded-xl disabled:opacity-50">
            {formLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};