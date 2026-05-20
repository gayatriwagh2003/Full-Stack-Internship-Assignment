import api from './axios';
import type { Lead, LeadFormData, LeadsResponse, LeadFilters } from '../types';

export const getLeadsApi = (filters: LeadFilters) =>
  api.get<LeadsResponse>('/leads', { params: filters });

export const createLeadApi = (data: LeadFormData) =>
  api.post<{ success: boolean; data: Lead }>('/leads', data);

export const updateLeadApi = (id: string, data: Partial<LeadFormData>) =>
  api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);

export const deleteLeadApi = (id: string) =>
  api.delete<{ success: boolean }>(`/leads/${id}`);

export const exportLeadsCSV = (filters: LeadFilters) =>
  api.get('/leads/export', { params: filters, responseType: 'blob' });