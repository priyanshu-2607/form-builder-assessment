import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

export function listFormSummaries() {
  return Form.find()
    .sort({ updatedAt: -1 })
    .select('title createdAt updatedAt');
}

export function createFormRecord(payload) {
  return Form.create(payload);
}

export function getFormById(id) {
  return Form.findById(id);
}

export function updateFormRecord(id, payload) {
  return Form.findByIdAndUpdate(id, payload, { new: true });
}

export function deleteFormRecord(id) {
  return Form.findByIdAndDelete(id);
}

export function createSubmissionRecord(form, values) {
  const fields = (form.fields || []).map((field) => ({
    fieldId: field.fieldId,
    type: field.type,
    label: field.label,
    placeholder: field.placeholder || '',
    value: values?.[field.fieldId] ?? '',
  }));

  return Submission.create({ formId: form._id, fields });
}
