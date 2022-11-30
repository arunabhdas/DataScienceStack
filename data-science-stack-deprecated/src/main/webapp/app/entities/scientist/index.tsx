import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Scientist from './scientist';
import ScientistDetail from './scientist-detail';
import ScientistUpdate from './scientist-update';
import ScientistDeleteDialog from './scientist-delete-dialog';

const ScientistRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Scientist />} />
    <Route path="new" element={<ScientistUpdate />} />
    <Route path=":id">
      <Route index element={<ScientistDetail />} />
      <Route path="edit" element={<ScientistUpdate />} />
      <Route path="delete" element={<ScientistDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ScientistRoutes;
