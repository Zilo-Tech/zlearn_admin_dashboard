import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { contentApi } from './api/contentApi';
import { coursesApi } from './api/coursesApi';
import { educationApi } from './api/educationApi';
import { aiCourseGenerationApi } from './api/aiCourseGenerationApi';
import { examsApi } from './api/examsApi';
import { usersApi } from './api/usersApi';

export const store = configureStore({
  reducer: {
    [contentApi.reducerPath]: contentApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [educationApi.reducerPath]: educationApi.reducer,
    [aiCourseGenerationApi.reducerPath]: aiCourseGenerationApi.reducer,
    [examsApi.reducerPath]: examsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      contentApi.middleware,
      coursesApi.middleware,
      educationApi.middleware,
      aiCourseGenerationApi.middleware,
      examsApi.middleware,
      usersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

