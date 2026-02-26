import Form from '../models/Form.js';

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

export function addFormSubmission(formId, values) {
  return Form.findByIdAndUpdate(
    formId,
    { $push: { submissions: { values } } },
    { new: true, select: '_id submissions' },
  );
}
