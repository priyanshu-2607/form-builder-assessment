import React from 'react';
import { Link } from 'react-router-dom';
import { useFormsList } from '../hooks/useFormsList.js';
import { ROUTES } from '../constants/routes.js';
import { useDeleteFormMutation } from '../store/api/formsApi.js';

export function HomePage() {
  const { forms, loading, error } = useFormsList();
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();

  const handleDelete = async (formId) => {
    if (!window.confirm('Delete this form? This cannot be undone.')) return;
    try {
      await deleteForm(formId).unwrap();
    } catch (err) {
      // No-op: keep UI simple for now
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Your All Forms</h1>
          <p className="muted">Create and manage reusable forms.</p>
        </div>
        <Link to={ROUTES.create} className="primary-btn">
          Create Form
        </Link>
      </div>

      <div className="card">
        <h2>All Forms</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : forms.length === 0 ? (
          <p className="muted">No forms yet. Create your first form.</p>
        ) : (
          <div className="form-list">
            {forms.map((form) => (
              <div key={form._id} className="form-list-item">
                <div>
                  <div className="form-title">{form.title}</div>
                  <div className="form-meta">
                    Last updated: {new Date(form.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="actions">
                  <Link to={ROUTES.view(form._id)} className="ghost-btn">
                    View
                  </Link>
                  <Link to={ROUTES.edit(form._id)} className="ghost-btn">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => handleDelete(form._id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
