import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Subject,
  ContentCourse,
  ContentModule,
  ContentLesson,
  ContentSection,
  QuizQuestion,
  QuizOption,
  LearningResource,
} from '../../interfaces/course';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function to extract array from API response
// Handles: direct arrays, paginated responses {results: []}, or nested {data: []}
const transformArrayResponse = <T>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  if (response?.results && Array.isArray(response.results)) return response.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Subject',
    'ContentCourse',
    'ContentModule',
    'ContentLesson',
    'ContentSection',
    'QuizQuestion',
    'QuizOption',
    'LearningResource',
  ],
  endpoints: (builder) => ({
    // Subjects
    getSubjects: builder.query<Subject[], void>({
      query: () => '/content/admin/subjects/',
      transformResponse: transformArrayResponse<Subject>,
      providesTags: ['Subject'],
    }),
    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (data) => ({
        url: '/content/admin/subjects/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation<Subject, { id: string; data: Partial<Subject> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/subjects/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Subject'],
    }),
    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/subjects/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),

    // Courses
    getCourses: builder.query<ContentCourse[], any>({
      query: (params = {}) => ({
        url: '/content/admin/courses/',
        params,
      }),
      transformResponse: transformArrayResponse<ContentCourse>,
      providesTags: ['ContentCourse'],
    }),
    getCourse: builder.query<ContentCourse, string>({
      query: (id) => `/content/admin/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: 'ContentCourse', id }],
    }),
    createCourse: builder.mutation<ContentCourse, Partial<ContentCourse> | FormData>({
      query: (data) => ({
        url: '/content/admin/courses/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentCourse'],
    }),
    updateCourse: builder.mutation<ContentCourse, { id: string; data: Partial<ContentCourse> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/courses/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ContentCourse'],
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/courses/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentCourse'],
    }),
    duplicateCourse: builder.mutation<ContentCourse, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/content/admin/courses/${id}/duplicate/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentCourse'],
    }),

    // Modules
    getModules: builder.query<ContentModule[], any>({
      query: (params = {}) => ({
        url: '/content/admin/modules/',
        params,
      }),
      transformResponse: transformArrayResponse<ContentModule>,
      providesTags: ['ContentModule'],
    }),
    createModule: builder.mutation<ContentModule, Partial<ContentModule>>({
      query: (data) => ({
        url: '/content/admin/modules/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentModule', 'ContentCourse'],
    }),
    updateModule: builder.mutation<ContentModule, { id: string; data: Partial<ContentModule> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/modules/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ContentModule', 'ContentCourse'],
    }),
    deleteModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/modules/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentModule', 'ContentCourse'],
    }),
    reorderModules: builder.mutation<void, { modules: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/content/admin/modules/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentModule'],
    }),

    // Lessons
    getLessons: builder.query<ContentLesson[], any>({
      query: (params = {}) => ({
        url: '/content/admin/lessons/',
        params,
      }),
      transformResponse: transformArrayResponse<ContentLesson>,
      providesTags: ['ContentLesson'],
    }),
    createLesson: builder.mutation<ContentLesson, Partial<ContentLesson>>({
      query: (data) => ({
        url: '/content/admin/lessons/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentLesson', 'ContentModule', 'ContentCourse'],
    }),
    updateLesson: builder.mutation<ContentLesson, { id: string; data: Partial<ContentLesson> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/lessons/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ContentLesson', 'ContentCourse'],
    }),
    deleteLesson: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/lessons/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentLesson', 'ContentModule', 'ContentCourse'],
    }),
    reorderLessons: builder.mutation<void, { lessons: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/content/admin/lessons/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentLesson'],
    }),

    // Sections
    getSections: builder.query<ContentSection[], any>({
      query: (params = {}) => ({
        url: '/content/admin/sections/',
        params,
      }),
      transformResponse: transformArrayResponse<ContentSection>,
      providesTags: ['ContentSection'],
    }),
    createSection: builder.mutation<ContentSection, Partial<ContentSection> | FormData>({
      query: (data) => ({
        url: '/content/admin/sections/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentSection', 'ContentLesson', 'ContentCourse'],
    }),
    updateSection: builder.mutation<ContentSection, { id: string; data: Partial<ContentSection> | FormData }>({
      query: ({ id, data }) => ({
        url: `/content/admin/sections/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ContentSection', 'ContentCourse'],
    }),
    deleteSection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/sections/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentSection', 'ContentLesson', 'ContentCourse'],
    }),
    reorderSections: builder.mutation<void, { sections: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/content/admin/sections/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContentSection'],
    }),

    // Quiz Questions
    getQuizQuestions: builder.query<QuizQuestion[], any>({
      query: (params = {}) => ({
        url: '/content/admin/quiz-questions/',
        params,
      }),
      transformResponse: transformArrayResponse<QuizQuestion>,
      providesTags: ['QuizQuestion'],
    }),
    createQuizQuestion: builder.mutation<QuizQuestion, Partial<QuizQuestion>>({
      query: (data) => ({
        url: '/content/admin/quiz-questions/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuizQuestion', 'ContentSection'],
    }),
    updateQuizQuestion: builder.mutation<QuizQuestion, { id: string; data: Partial<QuizQuestion> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/quiz-questions/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['QuizQuestion'],
    }),
    deleteQuizQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/quiz-questions/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuizQuestion', 'ContentSection'],
    }),

    // Quiz Options
    getQuizOptions: builder.query<QuizOption[], any>({
      query: (params = {}) => ({
        url: '/content/admin/quiz-options/',
        params,
      }),
      transformResponse: transformArrayResponse<QuizOption>,
      providesTags: ['QuizOption'],
    }),
    createQuizOption: builder.mutation<QuizOption, Partial<QuizOption>>({
      query: (data) => ({
        url: '/content/admin/quiz-options/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuizOption', 'QuizQuestion'],
    }),
    updateQuizOption: builder.mutation<QuizOption, { id: string; data: Partial<QuizOption> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/quiz-options/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['QuizOption'],
    }),
    deleteQuizOption: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/quiz-options/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuizOption', 'QuizQuestion'],
    }),

    // Learning Resources
    getResources: builder.query<LearningResource[], any>({
      query: (params = {}) => ({
        url: '/content/admin/resources/',
        params,
      }),
      transformResponse: transformArrayResponse<LearningResource>,
      providesTags: ['LearningResource'],
    }),
    createResource: builder.mutation<LearningResource, Partial<LearningResource>>({
      query: (data) => ({
        url: '/content/admin/resources/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LearningResource', 'ContentLesson'],
    }),
    updateResource: builder.mutation<LearningResource, { id: string; data: Partial<LearningResource> }>({
      query: ({ id, data }) => ({
        url: `/content/admin/resources/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['LearningResource'],
    }),
    deleteResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/content/admin/resources/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LearningResource', 'ContentLesson'],
    }),
    reorderResources: builder.mutation<void, { resources: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/content/admin/resources/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LearningResource'],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useLazyGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useDuplicateCourseMutation,
  useGetModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useReorderModulesMutation,
  useGetLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useReorderLessonsMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
  useGetQuizQuestionsQuery,
  useCreateQuizQuestionMutation,
  useUpdateQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
  useGetQuizOptionsQuery,
  useCreateQuizOptionMutation,
  useUpdateQuizOptionMutation,
  useDeleteQuizOptionMutation,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useReorderResourcesMutation,
} = contentApi;

