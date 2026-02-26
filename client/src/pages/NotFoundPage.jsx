import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>Page Not Found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to={ROUTES.home} className="ghost-btn">
        Back to Home
      </Link>
    </div>
  );
}
