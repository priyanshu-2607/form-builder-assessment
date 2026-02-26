import {
  validateFormPayload,
  validateSubmissionPayload,
} from '../validations/forms.validation.js';
import {
  createFormRecord,
  getFormById,
  listFormSummaries,
  updateFormRecord,
  deleteFormRecord,
  addFormSubmission,
} from '../services/forms.service.js';
import asyncHandler from '../middleware/asyncHandler.js';

async function listFormsImpl(req, res) {
  const forms = await listFormSummaries();
  res.json(forms);
}

async function createFormImpl(req, res) {
  const { title, fields, errors } = validateFormPayload(req.body);
  if (errors.length)
    return res.status(400).json({ message: errors[0], errors });

  const form = await createFormRecord({ title, fields });
  res.status(201).json(form);
}

async function getFormImpl(req, res) {
  const form = await getFormById(req.params.id);
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json(form);
}

async function updateFormImpl(req, res) {
  const { title, fields, errors } = validateFormPayload(req.body);
  if (errors.length)
    return res.status(400).json({ message: errors[0], errors });

  const form = await updateFormRecord(req.params.id, { title, fields });
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json(form);
}

async function deleteFormImpl(req, res) {
  const form = await deleteFormRecord(req.params.id);
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json({ ok: true });
}

async function submitFormImpl(req, res) {
  const form = await getFormById(req.params.id);
  if (!form) return res.status(404).json({ message: 'Form not found' });

  const { values, errors } = validateSubmissionPayload(req.body);
  if (errors.length)
    return res.status(400).json({ message: errors[0], errors });

  const updated = await addFormSubmission(form._id, values);
  if (!updated) return res.status(404).json({ message: 'Form not found' });

  const submission = updated.submissions[updated.submissions.length - 1];
  res.status(201).json({ ok: true, submissionId: submission?._id });
}

export const listForms = asyncHandler(listFormsImpl);
export const createForm = asyncHandler(createFormImpl);
export const getForm = asyncHandler(getFormImpl);
export const updateForm = asyncHandler(updateFormImpl);
export const deleteForm = asyncHandler(deleteFormImpl);
export const submitForm = asyncHandler(submitFormImpl);
