import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ROUTES } from '../constants/routes.js';
import {
  useGetFormQuery,
  useSubmitFormMutation,
} from '../store/api/formsApi.js';

export function ViewFormPage({ formId }) {
  const { data: form, isLoading, isError } = useGetFormQuery(formId);
  const [submitForm] = useSubmitFormMutation();

  const [status, setStatus] = useState('');

  const initialValues = useMemo(() => {
    const initial = {};
    (form?.fields || []).forEach((field) => {
      initial[field.fieldId] = '';
    });
    return initial;
  }, [form]);

  const schema = useMemo(() => {
    const shape = {};
    (form?.fields || []).forEach((field) => {
      const label = field.label || 'Field';
      if (field.type === 'email') {
        shape[field.fieldId] = yup
          .string()
          .trim()
          .email(`${label} must be a valid email address`)
          .required(`${label} is required`);
      } else if (field.type === 'password') {
        shape[field.fieldId] = yup
          .string()
          .required(`${label} is required`)
          .min(8, `${label} must be at least 8 characters`)
          .max(128, `${label} must be under 128 characters`);
      } else if (field.type === 'number') {
        shape[field.fieldId] = yup
          .number()
          .transform((value, originalValue) =>
            originalValue === '' ? undefined : Number(originalValue),
          )
          .typeError(`${label} must be a valid number`)
          .required(`${label} is required`);
      } else if (field.type === 'date') {
        shape[field.fieldId] = yup
          .date()
          .transform((value, originalValue) =>
            originalValue === '' ? undefined : new Date(originalValue),
          )
          .typeError(`${label} must be a valid date`)
          .required(`${label} is required`);
      } else {
        shape[field.fieldId] = yup
          .string()
          .trim()
          .required(`${label} is required`)
          .max(500, `${label} must be under 500 characters`);
      }
    });
    return yup.object().shape(shape);
  }, [form]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const onSubmit = async (values) => {
    setStatus('');
    try {
      await submitForm({ formId, values }).unwrap();
      setStatus('Form submitted successfully.');
      reset(initialValues);
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

      <form className="card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-grid">
          {(form.fields || []).map((field) => (
            <div key={field.fieldId} className="field-card">
              <label className="label">{field.label}</label>
              <input
                className="text-input"
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.fieldId)}
              />
              {errors?.[field.fieldId]?.message && (
                <p className="error-text muted">
                  {errors[field.fieldId].message}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          className="primary-btn mt-3"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
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
