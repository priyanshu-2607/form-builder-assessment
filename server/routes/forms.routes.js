import { Router } from 'express';
import {
  createForm,
  deleteForm,
  getForm,
  listForms,
  submitForm,
  updateForm,
} from '../controllers/forms.controller.js';

const router = Router();

router.get('/', listForms);
router.post('/', createForm);
router.get('/:id', getForm);
router.put('/:id', updateForm);
router.delete('/:id', deleteForm);
router.post('/:id/submissions', submitForm);
export default router;
