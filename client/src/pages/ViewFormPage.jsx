import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import {
  useGetFormQuery,
  useSubmitFormMutation,
} from '../store/api/formsApi.js';

export function ViewFormPage({ formId }) {
  const { data: form, isLoading, isError } = useGetFormQuery(formId);
  const [submitForm] = useSubmitFormMutation();

  const initialValues = useMemo(() => {
    const initial = {};
    (form?.fields || []).forEach((field) => {
      initial[field.fieldId] = '';
    });
    return initial;
  }, [form]);

  const [values, setValues] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      await submitForm({ formId, values }).unwrap();
      setStatus('Form submitted successfully.');
    } catch (err) {
      setStatus('Unable to submit form.');
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="page">
        <p className="error-text">Form not found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{form.title}</h1>
          <p className="muted">Fill out the form below.</p>
        </div>
        <Link to={ROUTES.edit(formId)} className="ghost-btn">
          Edit Form
        </Link>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div className="field-grid">
          {(form.fields || []).map((field) => (
            <div key={field.fieldId} className="field-card">
              <label className="label">{field.label}</label>
              <input
                className="text-input"
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.fieldId] || ''}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.fieldId]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
        <button className="primary-btn" type="submit">
          Submit
        </button>
        {status && (
          <p
            className={
              status.includes('success') ? 'success-text' : 'error-text'
            }
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
