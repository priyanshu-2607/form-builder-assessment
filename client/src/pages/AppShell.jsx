import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

export function AppShell({ children }) {
  return (
    <div className="app">
      <nav className="top-nav">
        <Link to={ROUTES.home} className="brand">
          Form Builder
        </Link>
        <div className="nav-actions">
          <Link to={ROUTES.create} className="ghost-btn">
            New Form
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
