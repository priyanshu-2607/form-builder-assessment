import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['email', 'text', 'password', 'number', 'date'],
    },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
  },
  { _id: false },
);

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fields: { type: [FieldSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Form', FormSchema);
