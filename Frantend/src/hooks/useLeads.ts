import { useState, useEffect, useCallback } from 'react';
import { getLeadsApi } from '../api/leads';
import type { Lead, LeadFilters, PaginationMeta } from '../types';

export const useLeads = (filters: LeadFilters) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0, page: 1, limit: 10, totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeadsApi(filters);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  return { leads, pagination, loading, error, refetch: fetchLeads };
};