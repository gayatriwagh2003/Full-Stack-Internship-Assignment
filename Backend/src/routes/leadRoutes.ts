import { Router } from 'express';
import { getLeads, getLeadById, createLead, updateLead, deleteLead, exportCSV } from '../controllers/leadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getLeads);
router.get('/export', exportCSV);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);

export default router;