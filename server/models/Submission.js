import mongoose from 'mongoose';

const SubmissionFieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['email', 'text', 'password', 'number', 'date'],
    },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  { _id: false },
);

const SubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
      index: true,
    },
    fields: { type: [SubmissionFieldSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Submission', SubmissionSchema);
