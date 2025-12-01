import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CourseCategory,
  Course,
  CourseModule,
  CourseLesson,
  CourseSection,
  SectionQuizQuestion,
  SectionQuizOption,
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

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
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
    'CourseCategory',
    'Course',
    'CourseModule',
    'CourseLesson',
    'CourseSection',
    'SectionQuizQuestion',
    'SectionQuizOption',
    'LearningResource',
  ],
  endpoints: (builder) => ({
    // Categories
    getCategories: builder.query<CourseCategory[], void>({
      query: () => '/courses/admin/categories/',
      transformResponse: transformArrayResponse<CourseCategory>,
      providesTags: ['CourseCategory'],
    }),
    createCategory: builder.mutation<CourseCategory, Partial<CourseCategory>>({
      query: (data) => ({
        url: '/courses/admin/categories/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseCategory'],
    }),
    updateCategory: builder.mutation<CourseCategory, { id: string; data: Partial<CourseCategory> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/categories/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CourseCategory'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CourseCategory'],
    }),

    // Courses
    getCourses: builder.query<Course[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/courses/',
        params,
      }),
      transformResponse: transformArrayResponse<Course>,
      providesTags: ['Course'],
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => `/courses/admin/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    createCourse: builder.mutation<Course, Partial<Course> | FormData>({
      query: (data) => {
        // Check if data is FormData (for file uploads) or regular object
        const isFormData = data instanceof FormData;
        return {
          url: '/courses/admin/courses/',
          method: 'POST',
          body: data,
          // Don't set Content-Type header for FormData - browser will set it with boundary
          ...(isFormData ? {} : {}),
        };
      },
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation<Course, { id: string; data: Partial<Course> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/courses/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/courses/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    duplicateCourse: builder.mutation<Course, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/courses/${id}/duplicate/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),

    // Course Modules
    getCourseModules: builder.query<CourseModule[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/modules/',
        params,
      }),
      transformResponse: transformArrayResponse<CourseModule>,
      providesTags: ['CourseModule'],
    }),
    createCourseModule: builder.mutation<CourseModule, Partial<CourseModule>>({
      query: (data) => ({
        url: '/courses/admin/modules/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseModule', 'Course'],
    }),
    updateCourseModule: builder.mutation<CourseModule, { id: string; data: Partial<CourseModule> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/modules/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CourseModule', 'Course'],
    }),
    deleteCourseModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/modules/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CourseModule', 'Course'],
    }),
    reorderCourseModules: builder.mutation<void, { modules: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/courses/admin/modules/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseModule'],
    }),

    // Course Lessons
    getCourseLessons: builder.query<CourseLesson[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/lessons/',
        params,
      }),
      transformResponse: transformArrayResponse<CourseLesson>,
      providesTags: ['CourseLesson'],
    }),
    createCourseLesson: builder.mutation<CourseLesson, Partial<CourseLesson>>({
      query: (data) => ({
        url: '/courses/admin/lessons/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseLesson', 'CourseModule', 'Course'],
    }),
    updateCourseLesson: builder.mutation<CourseLesson, { id: string; data: Partial<CourseLesson> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/lessons/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CourseLesson', 'Course'],
    }),
    deleteCourseLesson: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/lessons/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CourseLesson', 'CourseModule', 'Course'],
    }),
    duplicateCourseLesson: builder.mutation<CourseLesson, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/lessons/${id}/duplicate/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseLesson'],
    }),
    reorderCourseLessons: builder.mutation<void, { lessons: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/courses/admin/lessons/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseLesson'],
    }),

    // Course Sections
    getCourseSections: builder.query<CourseSection[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/sections/',
        params,
      }),
      transformResponse: transformArrayResponse<CourseSection>,
      providesTags: ['CourseSection'],
    }),
    createCourseSection: builder.mutation<CourseSection, Partial<CourseSection>>({
      query: (data) => ({
        url: '/courses/admin/sections/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseSection', 'CourseLesson', 'Course'],
    }),
    updateCourseSection: builder.mutation<CourseSection, { id: string; data: Partial<CourseSection> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/sections/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CourseSection', 'Course'],
    }),
    deleteCourseSection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/sections/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CourseSection', 'CourseLesson', 'Course'],
    }),
    reorderCourseSections: builder.mutation<void, { sections: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/courses/admin/sections/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CourseSection'],
    }),

    // Section Quiz Questions
    getSectionQuizQuestions: builder.query<SectionQuizQuestion[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/quiz-questions/',
        params,
      }),
      transformResponse: transformArrayResponse<SectionQuizQuestion>,
      providesTags: ['SectionQuizQuestion'],
    }),
    createSectionQuizQuestion: builder.mutation<SectionQuizQuestion, Partial<SectionQuizQuestion>>({
      query: (data) => ({
        url: '/courses/admin/quiz-questions/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SectionQuizQuestion', 'CourseSection'],
    }),
    updateSectionQuizQuestion: builder.mutation<SectionQuizQuestion, { id: string; data: Partial<SectionQuizQuestion> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/quiz-questions/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SectionQuizQuestion'],
    }),
    deleteSectionQuizQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/quiz-questions/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SectionQuizQuestion', 'CourseSection'],
    }),

    // Section Quiz Options
    getSectionQuizOptions: builder.query<SectionQuizOption[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/quiz-options/',
        params,
      }),
      transformResponse: transformArrayResponse<SectionQuizOption>,
      providesTags: ['SectionQuizOption'],
    }),
    createSectionQuizOption: builder.mutation<SectionQuizOption, Partial<SectionQuizOption>>({
      query: (data) => ({
        url: '/courses/admin/quiz-options/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SectionQuizOption', 'SectionQuizQuestion'],
    }),
    updateSectionQuizOption: builder.mutation<SectionQuizOption, { id: string; data: Partial<SectionQuizOption> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/quiz-options/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['SectionQuizOption'],
    }),
    deleteSectionQuizOption: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/quiz-options/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SectionQuizOption', 'SectionQuizQuestion'],
    }),

    // Learning Resources (same structure as Content App)
    getCourseResources: builder.query<LearningResource[], any>({
      query: (params = {}) => ({
        url: '/courses/admin/resources/',
        params,
      }),
      transformResponse: transformArrayResponse<LearningResource>,
      providesTags: ['LearningResource'],
    }),
    createCourseResource: builder.mutation<LearningResource, Partial<LearningResource>>({
      query: (data) => ({
        url: '/courses/admin/resources/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LearningResource', 'CourseLesson'],
    }),
    updateCourseResource: builder.mutation<LearningResource, { id: string; data: Partial<LearningResource> }>({
      query: ({ id, data }) => ({
        url: `/courses/admin/resources/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['LearningResource'],
    }),
    deleteCourseResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/admin/resources/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LearningResource', 'CourseLesson'],
    }),
    reorderCourseResources: builder.mutation<void, { resources: Array<{ id: string; order: number }> }>({
      query: (data) => ({
        url: '/courses/admin/resources/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LearningResource'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useLazyGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useDuplicateCourseMutation,
  useGetCourseModulesQuery,
  useCreateCourseModuleMutation,
  useUpdateCourseModuleMutation,
  useDeleteCourseModuleMutation,
  useReorderCourseModulesMutation,
  useGetCourseLessonsQuery,
  useCreateCourseLessonMutation,
  useUpdateCourseLessonMutation,
  useDeleteCourseLessonMutation,
  useDuplicateCourseLessonMutation,
  useReorderCourseLessonsMutation,
  useGetCourseSectionsQuery,
  useCreateCourseSectionMutation,
  useUpdateCourseSectionMutation,
  useDeleteCourseSectionMutation,
  useReorderCourseSectionsMutation,
  useGetSectionQuizQuestionsQuery,
  useCreateSectionQuizQuestionMutation,
  useUpdateSectionQuizQuestionMutation,
  useDeleteSectionQuizQuestionMutation,
  useGetSectionQuizOptionsQuery,
  useCreateSectionQuizOptionMutation,
  useUpdateSectionQuizOptionMutation,
  useDeleteSectionQuizOptionMutation,
  useGetCourseResourcesQuery,
  useCreateCourseResourceMutation,
  useUpdateCourseResourceMutation,
  useDeleteCourseResourceMutation,
  useReorderCourseResourcesMutation,
} = coursesApi;

