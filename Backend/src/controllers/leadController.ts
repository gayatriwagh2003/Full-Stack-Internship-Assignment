import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../types';

// GET all leads with filter, search, sort, pagination
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page = 1 } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const [data, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
      Lead.countDocuments(query),
    ]);

    res.json({ success: true, data, pagination: { total, page: Number(page), limit, totalPages: Math.ceil(total / limit) } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET single lead
export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    res.json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CREATE lead
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;
    if (!name || !email || !source) {
      res.status(400).json({ success: false, message: 'Name, email and source are required' });
      return;
    }
    const lead = await Lead.create({ name, email, status, source, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE lead
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    res.json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE lead (admin only)
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) { res.status(404).json({ success: false, message: 'Lead not found' }); return; }
    res.json({ success: true, message: 'Lead deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CSV Export
export const exportCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find({});
    const header = 'Name,Email,Status,Source,Created At\n';
    const rows = leads.map(l =>
     `${l.name},${l.email},${l.status},${l.source},${l.createdAt ? new Date(l.createdAt.toString()).toLocaleDateString() : ''}`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(header + rows);
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};