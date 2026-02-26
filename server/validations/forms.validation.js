const VALID_TYPES = ['email', 'text', 'password', 'number', 'date'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT_LENGTH = 500;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

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

export function validateSubmissionPayload(payload, form) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { values: {}, errors: ['Submission payload must be an object'] };
  }
  const fields = Array.isArray(form?.fields) ? form.fields : [];
  const fieldIds = new Set(fields.map((field) => field.fieldId));
  const normalizedValues = {};

  Object.keys(payload).forEach((key) => {
    if (!fieldIds.has(key)) {
      errors.push(`Unknown field submitted: ${key}`);
    }
  });

  fields.forEach((field) => {
    const rawValue = payload[field.fieldId];
    const label = field.label || 'Field';

    if (rawValue === undefined || rawValue === null || rawValue === '') {
      errors.push(`${label} is required`);
      return;
    }

    if (field.type === 'text') {
      const value = String(rawValue).trim();
      if (!value) errors.push(`${label} is required`);
      if (value.length > MAX_TEXT_LENGTH)
        errors.push(`${label} must be under ${MAX_TEXT_LENGTH} characters`);
      normalizedValues[field.fieldId] = value;
      return;
    }

    if (field.type === 'email') {
      const value = String(rawValue).trim();
      if (!value) errors.push(`${label} is required`);
      if (value.length > MAX_EMAIL_LENGTH)
        errors.push(`${label} must be under ${MAX_EMAIL_LENGTH} characters`);
      if (value && !EMAIL_REGEX.test(value))
        errors.push(`${label} must be a valid email address`);
      normalizedValues[field.fieldId] = value;
      return;
    }

    if (field.type === 'password') {
      const value = String(rawValue);
      if (value.length < MIN_PASSWORD_LENGTH)
        errors.push(`${label} must be at least ${MIN_PASSWORD_LENGTH} characters`);
      if (value.length > MAX_PASSWORD_LENGTH)
        errors.push(`${label} must be under ${MAX_PASSWORD_LENGTH} characters`);
      normalizedValues[field.fieldId] = value;
      return;
    }

    if (field.type === 'number') {
      const value = Number(rawValue);
      if (!Number.isFinite(value))
        errors.push(`${label} must be a valid number`);
      normalizedValues[field.fieldId] = String(value);
      return;
    }

    if (field.type === 'date') {
      const value = new Date(rawValue);
      if (Number.isNaN(value.getTime()))
        errors.push(`${label} must be a valid date`);
      normalizedValues[field.fieldId] = value.toISOString();
      return;
    }

    errors.push(`${label} has an invalid type`);
  });

  return { values: normalizedValues, errors };
}
