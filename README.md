# Form Builder Assessment — Pepper Cloud

This repository contains a full‑stack form builder assessment. Users can create custom forms, view them with the exact structure created, validate inputs, and submit responses that are stored as submissions.

## Highlights
- Build forms with up to 20 inputs (text, email, password, number, date)
- Drag-and-drop field ordering
- View form with the same structure as created
- Client + server validation on submit
- Submissions stored in a dedicated `submissions` collection

## Tech Stack
- **Frontend:** React (Vite), React Router, Redux Toolkit, React Hook Form + Yup
- **Backend:** Node.js, Express, MongoDB (Mongoose)

## Setup
1. **Clone and install**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment variables**
   - Create `server/.env` using `server/.env.example`
   - Example:
     ```bash
     MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-host>/<database>"
     ```

3. **Run**
   ```bash
   # terminal 1
   cd server
   npm run dev

   # terminal 2
   cd client
   npm run dev
   ```

## Key Features
### Form Builder
- Create or edit a form title
- Add fields with labels and placeholders
- Reorder fields with drag-and-drop

### Form Rendering + Submission
- Form renders exactly as created
- Validations enforced on submit (frontend + backend)
- Submit creates a `Submission` document linked to the form

## Validation Rules (Industry Standards)
