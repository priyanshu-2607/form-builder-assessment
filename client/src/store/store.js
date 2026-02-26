import { configureStore } from '@reduxjs/toolkit';
import { formsApi } from './api/formsApi.js';

export const store = configureStore({
  reducer: {
    [formsApi.reducerPath]: formsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(formsApi.middleware),
});
