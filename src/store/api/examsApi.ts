import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Exam,
  ExamCourse,
  ExamModule,
  ExamLesson,
  MockExam,
  MockExamQuestion,
  PastPaper,
  ExamEnrollment,
} from '../../interfaces/exam';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const transformArrayResponse = <T>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  if (response?.results && Array.isArray(response.results)) return response.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

export const examsApi = createApi({
  reducerPath: 'examsApi',
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
  tagTypes: ['Exam', 'ExamCourse', 'ExamModule', 'ExamLesson', 'MockExam', 'PastPaper', 'ExamEnrollment'],
  endpoints: (builder) => ({
    // Exams
    getExams: builder.query<Exam[], any>({
      query: (params = {}) => ({
        url: '/exams/admin/exams/',
        params,
      }),
      transformResponse: transformArrayResponse<Exam>,
      providesTags: ['Exam'],
    }),
    getExam: builder.query<Exam, string>({
      query: (id) => `/exams/admin/exams/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Exam', id }],
    }),
    createExam: builder.mutation<Exam, Partial<Exam> | FormData>({
      query: (data) => ({
        url: '/exams/admin/exams/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exam'],
    }),
    updateExam: builder.mutation<Exam, { id: string; data: Partial<Exam> | FormData }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/exams/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Exam'],
    }),
    deleteExam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/exams/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exam'],
    }),

    // Exam Courses (Subjects within an exam)
    getExamCourses: builder.query<ExamCourse[], string>({
      query: (examId) => `/exams/admin/exams/${examId}/courses/`,
      transformResponse: transformArrayResponse<ExamCourse>,
      providesTags: ['ExamCourse'],
    }),
    createExamCourse: builder.mutation<ExamCourse, Partial<ExamCourse>>({
      query: (data) => ({
        url: '/exams/admin/courses/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamCourse', 'Exam'],
    }),
    updateExamCourse: builder.mutation<ExamCourse, { id: string; data: Partial<ExamCourse> }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/courses/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ExamCourse'],
    }),
    deleteExamCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/courses/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExamCourse', 'Exam'],
    }),

    // Exam Modules
    createExamModule: builder.mutation<ExamModule, Partial<ExamModule>>({
      query: (data) => ({
        url: '/exams/admin/modules/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamModule', 'ExamCourse'],
    }),
    updateExamModule: builder.mutation<ExamModule, { id: string; data: Partial<ExamModule> }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/modules/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ExamModule'],
    }),
    deleteExamModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/modules/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExamModule', 'ExamCourse'],
    }),

    // Exam Lessons
    createExamLesson: builder.mutation<ExamLesson, Partial<ExamLesson>>({
      query: (data) => ({
        url: '/exams/admin/lessons/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamLesson', 'ExamModule'],
    }),
    updateExamLesson: builder.mutation<ExamLesson, { id: string; data: Partial<ExamLesson> }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/lessons/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    deleteExamLesson: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/lessons/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExamLesson', 'ExamModule'],
    }),

    // Mock Exams
    getMockExams: builder.query<MockExam[], string>({
      query: (examId) => `/exams/admin/exams/${examId}/mock-exams/`,
      transformResponse: transformArrayResponse<MockExam>,
      providesTags: ['MockExam'],
    }),
    getMockExamsList: builder.query<MockExam[], { exam?: string }>({
      query: (params = {}) => ({ url: '/exams/admin/mock-exams/', params }),
      transformResponse: transformArrayResponse<MockExam>,
      providesTags: ['MockExam'],
    }),
    getMockExam: builder.query<MockExam, string>({
      query: (id) => `/exams/admin/mock-exams/${id}/`,
      providesTags: (result, error, id) => [{ type: 'MockExam', id }],
    }),
    createMockExam: builder.mutation<MockExam, Partial<MockExam> & { time_limit_minutes?: number; passing_marks?: number }>({
      query: (data) => {
        const body: Record<string, any> = { ...data };
        if ('duration_minutes' in data && body.duration_minutes != null) {
          body.time_limit_minutes = body.duration_minutes;
          delete body.duration_minutes;
        }
        if ('passing_score' in data && body.passing_score != null) {
          body.passing_marks = body.passing_score;
          delete body.passing_score;
        }
        if (body.time_limit_minutes == null && body.duration_minutes == null) {
          body.time_limit_minutes = 60;
        }
        if (body.passing_marks == null && body.passing_score == null) {
          body.passing_marks = 50;
        }
        return { url: '/exams/admin/mock-exams/', method: 'POST', body };
      },
      invalidatesTags: ['MockExam'],
    }),
    updateMockExam: builder.mutation<MockExam, { id: string; data: Partial<MockExam> }>({
      query: ({ id, data }) => {
        const body: Record<string, any> = { ...data };
        if ('duration_minutes' in data && body.duration_minutes != null) {
          body.time_limit_minutes = body.duration_minutes;
          delete body.duration_minutes;
        }
        if ('passing_score' in data && body.passing_score != null) {
          body.passing_marks = body.passing_score;
          delete body.passing_score;
        }
        return { url: `/exams/admin/mock-exams/${id}/`, method: 'PATCH', body };
      },
      invalidatesTags: ['MockExam'],
    }),
    deleteMockExam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/mock-exams/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MockExam'],
    }),

    // Mock Exam Questions
    createMockExamQuestion: builder.mutation<MockExamQuestion, Partial<MockExamQuestion>>({
      query: (data) => ({
        url: '/exams/admin/mock-exam-questions/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MockExam'],
    }),
    updateMockExamQuestion: builder.mutation<MockExamQuestion, { id: string; data: Partial<MockExamQuestion> }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/mock-exam-questions/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MockExam'],
    }),
    deleteMockExamQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/mock-exam-questions/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MockExam'],
    }),

    // Past Papers
    getPastPapers: builder.query<PastPaper[], string>({
      query: (examId) => `/exams/admin/exams/${examId}/past-papers/`,
      transformResponse: transformArrayResponse<PastPaper>,
      providesTags: ['PastPaper'],
    }),
    getPastPapersList: builder.query<PastPaper[], { exam?: string }>({
      query: (params = {}) => ({ url: '/exams/admin/past-papers/', params }),
      transformResponse: transformArrayResponse<PastPaper>,
      providesTags: ['PastPaper'],
    }),
    createPastPaper: builder.mutation<PastPaper, FormData>({
      query: (data) => ({
        url: '/exams/admin/past-papers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PastPaper'],
    }),
    updatePastPaper: builder.mutation<PastPaper, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/past-papers/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PastPaper'],
    }),
    deletePastPaper: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/past-papers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PastPaper'],
    }),

    // Enrollments
    getExamEnrollments: builder.query<ExamEnrollment[], string>({
      query: (examId) => `/exams/admin/exams/${examId}/enrollments/`,
      transformResponse: transformArrayResponse<ExamEnrollment>,
      providesTags: ['ExamEnrollment'],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamCoursesQuery,
  useCreateExamCourseMutation,
  useUpdateExamCourseMutation,
  useDeleteExamCourseMutation,
  useCreateExamModuleMutation,
  useUpdateExamModuleMutation,
  useDeleteExamModuleMutation,
  useCreateExamLessonMutation,
  useUpdateExamLessonMutation,
  useDeleteExamLessonMutation,
  useGetMockExamsQuery,
  useGetMockExamsListQuery,
  useGetMockExamQuery,
  useCreateMockExamMutation,
  useUpdateMockExamMutation,
  useDeleteMockExamMutation,
  useCreateMockExamQuestionMutation,
  useUpdateMockExamQuestionMutation,
  useDeleteMockExamQuestionMutation,
  useGetPastPapersQuery,
  useGetPastPapersListQuery,
  useCreatePastPaperMutation,
  useUpdatePastPaperMutation,
  useDeletePastPaperMutation,
  useGetExamEnrollmentsQuery,
} = examsApi;
