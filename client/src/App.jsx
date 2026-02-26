import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { ROUTES } from './constants/routes.js';
import { HomePage } from './pages/HomePage.jsx';
import { FormEditorPage } from './pages/FormEditorPage.jsx';
import { ViewFormPage } from './pages/ViewFormPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { AppShell } from './pages/AppShell.jsx';

function EditFormRoute() {
  const { id } = useParams();
  return <FormEditorPage mode="edit" formId={id} />;
}

function ViewFormRoute() {
  const { id } = useParams();
  return <ViewFormPage formId={id} />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route
          path={ROUTES.create}
          element={<FormEditorPage mode="create" />}
        />
        <Route path="/form/:id/edit" element={<EditFormRoute />} />
        <Route path="/form/:id" element={<ViewFormRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
