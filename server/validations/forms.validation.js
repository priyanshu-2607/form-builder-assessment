const VALID_TYPES = ['email', 'text', 'password', 'number', 'date'];

export function validateFormPayload(payload) {
  const errors = [];
  const title = typeof payload?.title === 'string' ? payload.title.trim() : '';

  if (!title) {
    errors.push('Title is required');
  }

  const fields = Array.isArray(payload?.fields) ? payload.fields : [];
  if (fields.length > 20) {
    errors.push('Maximum 20 inputs allowed');
  }

  fields.forEach((field, index) => {
    if (!field || typeof field !== 'object') {
      errors.push(`Field #${index + 1} is invalid`);
      return;
    }
    if (!field.fieldId || typeof field.fieldId !== 'string') {
      errors.push(`Field #${index + 1} is missing fieldId`);
    }
    if (!VALID_TYPES.includes(field.type)) {
      errors.push(`Field #${index + 1} has invalid type`);
    }
    if (!field.label || typeof field.label !== 'string') {
      errors.push(`Field #${index + 1} is missing label`);
    }
  });

  return { title, fields, errors };
}

export function validateSubmissionPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { values: {}, errors: ['Submission payload must be an object'] };
  }
  return { values: payload, errors: [] };
}
