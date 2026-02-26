import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableFieldCard } from '../components/SortableFieldCard.jsx';
import { INPUT_TYPES } from '../constants/inputTypes.js';
import { ROUTES } from '../constants/routes.js';
import {
  useCreateFormMutation,
  useDeleteFormMutation,
  useGetFormQuery,
  useUpdateFormMutation,
} from '../store/api/formsApi.js';

export function FormEditorPage({ mode, formId }) {
  const navigate = useNavigate();
  const isEdit = mode === 'edit';
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [error, setError] = useState('');

  const [newType, setNewType] = useState('text');
  const [newLabel, setNewLabel] = useState('');
  const [newPlaceholder, setNewPlaceholder] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const {
    data: form,
    isLoading,
    isError,
  } = useGetFormQuery(formId, {
    skip: !isEdit,
  });

  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();

  useEffect(() => {
    if (!isEdit || !form) return;
    setTitle(form.title || '');
    setFields(Array.isArray(form.fields) ? form.fields : []);
  }, [isEdit, form]);

  useEffect(() => {
    if (isEdit && isError) {
      setError('Failed to load form.');
    }
  }, [isEdit, isError]);

  const canAdd = fields.length < 20 && newLabel.trim().length > 0;

  const addField = () => {
    if (!canAdd) return;
    const fieldId = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
    setFields((prev) => [
      ...prev,
      {
        fieldId,
        type: newType,
        label: newLabel.trim(),
        placeholder: newPlaceholder.trim(),
      },
    ]);
    setNewLabel('');
    setNewPlaceholder('');
  };

  const removeField = (fieldId) => {
    setFields((prev) => prev.filter((field) => field.fieldId !== fieldId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFields((prev) => {
      const oldIndex = prev.findIndex((item) => item.fieldId === active.id);
      const newIndex = prev.findIndex((item) => item.fieldId === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const saveForm = async () => {
    setError('');
    if (!title.trim()) {
      setError('Form title is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = { title: title.trim(), fields };
      const data = isEdit
        ? await updateForm({ formId, payload }).unwrap()
        : await createForm(payload).unwrap();
      navigate(ROUTES.view(data._id));
    } catch (err) {
      setError('Unable to save the form.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!window.confirm('Delete this form? This cannot be undone.')) return;
    setError('');
    try {
      await deleteForm(formId).unwrap();
      navigate(ROUTES.home);
    } catch (err) {
      setError('Unable to delete the form.');
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="page">
        <p className="muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Form' : 'Create Form'}</h1>
          <p className="muted">
            Design inputs and keep a maximum of 20 fields.
          </p>
        </div>
        <div className="actions">
          {isEdit && (
            <button
              type="button"
              className="ghost-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Form'}
            </button>
          )}
          <button className="primary-btn" onClick={saveForm} disabled={saving}>
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>

      <div className="editor-grid">
        <div className="card">
          <label className="label">Form Title</label>
          <input
            className="text-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter form title"
          />

          <div className="divider" />

          <h2>Add Input</h2>
          <label className="label">Input Type</label>
          <select
            className="text-input"
            value={newType}
            onChange={(event) => setNewType(event.target.value)}
          >
            {INPUT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <label className="label">Input Title</label>
          <input
            className="text-input"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            placeholder="e.g. Email Address"
          />

          <label className="label">Placeholder</label>
          <input
            className="text-input"
            value={newPlaceholder}
            onChange={(event) => setNewPlaceholder(event.target.value)}
            placeholder="e.g. name@company.com"
          />

          <button className="ghost-btn mt-4" onClick={addField} disabled={!canAdd}>
            Add Input
          </button>
          <p className="muted mt-1">{fields.length}/20 inputs</p>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="card">
          <h2>Form Preview</h2>
          <p className="muted drag-hint">
            Drag and drop inputs to arrange them.
          </p>
          {fields.length === 0 ? (
            <p className="muted">
              No inputs yet. Add some from the left panel.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field.fieldId)}
                strategy={rectSortingStrategy}
              >
                <div className="field-grid">
                  {fields.map((field) => (
                    <SortableFieldCard
                      key={field.fieldId}
                      field={field}
                      onRemove={removeField}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
