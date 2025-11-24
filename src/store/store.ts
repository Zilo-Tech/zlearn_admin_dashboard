import { configureStore } from '@reduxjs/toolkit';
import { contentApi } from './api/contentApi';
import { coursesApi } from './api/coursesApi';
import { educationApi } from './api/educationApi';

export const store = configureStore({
  reducer: {
    [contentApi.reducerPath]: contentApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [educationApi.reducerPath]: educationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      contentApi.middleware,
      coursesApi.middleware,
      educationApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

