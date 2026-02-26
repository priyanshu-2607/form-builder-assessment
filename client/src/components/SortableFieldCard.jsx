import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableFieldCard({ field, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.fieldId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`field-card draggable${isDragging ? ' dragging' : ''}`}
    >
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </div>
      <label className="label">{field.label}</label>
      <input
        className="text-input"
        type={field.type}
        placeholder={field.placeholder}
        readOnly
      />
      <button className="danger-btn" onClick={() => onRemove(field.fieldId)}>
        Delete
      </button>
    </div>
  );
}
