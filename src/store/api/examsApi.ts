import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Exam,
  ExamCourse,
  ExamModule,
  ExamLesson,
  ExamLessonSection,
  ExamResource,
  MockExam,
  MockExamQuestion,
  PastPaper,
  ExamEnrollment,
  ExamStatistics,
  PaginatedResponse,
  PaginationMeta,
} from '../../interfaces/exam';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const transformArrayResponse = <T>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  if (response?.results && Array.isArray(response.results)) return response.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

/** Backend returns { pagination, results }; default page_size 20, max 100 */
const transformPaginatedResponse = <T>(response: any): PaginatedResponse<T> => {
  const results = Array.isArray(response?.results) ? response.results : [];
  const pagination = response?.pagination as PaginationMeta | undefined;
  return { results, pagination };
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
    // Exams (paginated: page, page_size; response has pagination + results)
    getExams: builder.query<PaginatedResponse<Exam>, Record<string, string | number | undefined>>({
      query: (params = {}) => ({
        url: '/exams/admin/exams/',
        params: { page_size: 20, ...params },
      }),
      transformResponse: transformPaginatedResponse<Exam>,
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
    importExamPackage: builder.mutation<
      { message: string; exam: { id: string; title: string; slug?: string; status?: string }; stats?: Record<string, number> },
      File
    >({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/exams/admin/exams/import_exam/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Exam'],
    }),
    importExamCourse: builder.mutation<
      { message: string; course: any },
      { examId: string; file: File }
    >({
      query: ({ examId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('exam_id', examId);
        return {
          url: '/exams/admin/courses/import-course/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ExamCourse', 'Exam'],
    }),

    // Exam Courses (Subjects within an exam)
    getExamCourses: builder.query<ExamCourse[], string>({
      query: (examId) => `/exams/admin/exams/${examId}/courses/`,
      transformResponse: transformArrayResponse<ExamCourse>,
      providesTags: ['ExamCourse'],
    }),
    getExamCourse: builder.query<ExamCourse, string>({
      query: (courseId) => `/exams/admin/courses/${courseId}/`,
      providesTags: (result, error, id) => [{ type: 'ExamCourse', id }],
    }),
    getCourseModules: builder.query<ExamModule[], string>({
      query: (courseId) => `/exams/admin/courses/${courseId}/modules/`,
      transformResponse: transformArrayResponse<ExamModule>,
      providesTags: ['ExamModule'],
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
    reorderCourses: builder.mutation<void, { course_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/courses/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExamCourse', 'Exam'],
    }),

    // Exam Modules (doc: exam_course for create)
    createExamModule: builder.mutation<ExamModule, Partial<ExamModule> & { exam_course?: string }>({
      query: (data) => ({
        url: '/exams/admin/modules/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamModule', 'ExamCourse'],
    }),
    getModuleLessons: builder.query<ExamLesson[], string>({
      query: (moduleId) => `/exams/admin/modules/${moduleId}/lessons/`,
      transformResponse: transformArrayResponse<ExamLesson>,
      providesTags: ['ExamLesson'],
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
    reorderModules: builder.mutation<void, { module_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/modules/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExamModule', 'ExamCourse'],
    }),
    getLessonSections: builder.query<ExamLessonSection[], string>({
      query: (lessonId) => `/exams/admin/lessons/${lessonId}/sections/`,
      transformResponse: transformArrayResponse<ExamLessonSection>,
      providesTags: ['ExamLesson'],
    }),
    getLessonResources: builder.query<ExamResource[], string>({
      query: (lessonId) => `/exams/admin/lessons/${lessonId}/resources/`,
      transformResponse: transformArrayResponse<ExamResource>,
      providesTags: ['ExamLesson'],
    }),
    reorderSections: builder.mutation<void, { section_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/sections/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    reorderResources: builder.mutation<void, { resource_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/resources/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    createExamSection: builder.mutation<ExamLessonSection, Partial<ExamLessonSection> & { lesson: string }>({
      query: (data) => ({
        url: '/exams/admin/sections/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    updateExamSection: builder.mutation<ExamLessonSection, { id: string; data: Partial<ExamLessonSection> }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/sections/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    deleteExamSection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/sections/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    createExamResource: builder.mutation<ExamResource, Partial<ExamResource> & { lesson: string }>({
      query: (data) => ({
        url: '/exams/admin/resources/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    updateExamResource: builder.mutation<ExamResource, { id: string; data: Partial<ExamResource> }>({
      query: ({ id, data }) => ({
        url: `/exams/admin/resources/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ExamLesson'],
    }),
    deleteExamResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exams/admin/resources/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExamLesson'],
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
    reorderLessons: builder.mutation<void, { lesson_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/lessons/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExamLesson', 'ExamModule'],
    }),

    // Exam Statistics (dashboard overview)
    getExamStatistics: builder.query<ExamStatistics, string>({
      query: (examId) => `/exams/admin/exams/${examId}/statistics/`,
      providesTags: (result, error, examId) => [{ type: 'Exam', id: examId }],
    }),

    // Mock Exams (backend: use hyphens in URL)
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
    reorderMockExams: builder.mutation<void, { mock_exam_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/mock-exams/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MockExam'],
    }),

    // Mock Exam Questions (doc §4.3: GET mock-exams/{id}/questions/)
    getMockExamQuestions: builder.query<MockExamQuestion[], string>({
      query: (mockExamId) => `/exams/admin/mock-exams/${mockExamId}/questions/`,
      transformResponse: transformArrayResponse<MockExamQuestion>,
      providesTags: ['MockExam'],
    }),
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
    reorderMockExamQuestions: builder.mutation<void, { question_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/mock-exam-questions/reorder/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MockExam'],
    }),

    // Past Papers (backend: use hyphens in URL)
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
    createPastPaper: builder.mutation<PastPaper, Partial<PastPaper> & { exam: string }>({
      query: (data) => ({
        url: '/exams/admin/past-papers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PastPaper'],
    }),
    updatePastPaper: builder.mutation<PastPaper, { id: string; data: Partial<PastPaper> }>({
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
    reorderPastPapers: builder.mutation<void, { past_paper_ids: string[] }>({
      query: (body) => ({
        url: '/exams/admin/past-papers/reorder/',
        method: 'POST',
        body,
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
  useImportExamPackageMutation,
  useImportExamCourseMutation,
  useGetExamStatisticsQuery,
  useGetExamCoursesQuery,
  useGetExamCourseQuery,
  useGetCourseModulesQuery,
  useCreateExamCourseMutation,
  useUpdateExamCourseMutation,
  useDeleteExamCourseMutation,
  useReorderCoursesMutation,
  useCreateExamModuleMutation,
  useUpdateExamModuleMutation,
  useDeleteExamModuleMutation,
  useReorderModulesMutation,
  useGetModuleLessonsQuery,
  useGetLessonSectionsQuery,
  useGetLessonResourcesQuery,
  useReorderSectionsMutation,
  useReorderResourcesMutation,
  useCreateExamSectionMutation,
  useUpdateExamSectionMutation,
  useDeleteExamSectionMutation,
  useCreateExamResourceMutation,
  useUpdateExamResourceMutation,
  useDeleteExamResourceMutation,
  useCreateExamLessonMutation,
  useUpdateExamLessonMutation,
  useDeleteExamLessonMutation,
  useReorderLessonsMutation,
  useGetMockExamsQuery,
  useGetMockExamsListQuery,
  useGetMockExamQuery,
  useCreateMockExamMutation,
  useUpdateMockExamMutation,
  useDeleteMockExamMutation,
  useReorderMockExamsMutation,
  useGetMockExamQuestionsQuery,
  useCreateMockExamQuestionMutation,
  useUpdateMockExamQuestionMutation,
  useDeleteMockExamQuestionMutation,
  useReorderMockExamQuestionsMutation,
  useGetPastPapersQuery,
  useGetPastPapersListQuery,
  useCreatePastPaperMutation,
  useUpdatePastPaperMutation,
  useDeletePastPaperMutation,
  useReorderPastPapersMutation,
  useGetExamEnrollmentsQuery,
} = examsApi;
