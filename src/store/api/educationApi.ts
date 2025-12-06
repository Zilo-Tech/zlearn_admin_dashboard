import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/education/admin/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Helper to transform array responses
const transformArrayResponse = (response: any): any[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response?.results && Array.isArray(response.results)) {
    return response.results;
  }
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const educationApi = createApi({
  reducerPath: 'educationApi',
  baseQuery,
  tagTypes: [
    'Country',
    'EducationLevel',
    'School',
    'Faculty',
    'ClassLevel',
    'Program',
    'Curriculum',
    'Subject',
  ],
  endpoints: (builder) => ({
    // Countries
    getCountries: builder.query({
      query: (params = {}) => ({
        url: 'countries/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['Country'],
    }),
    getCountry: builder.query({
      query: (id) => `countries/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Country', id }],
    }),
    createCountry: builder.mutation({
      query: (data) => ({
        url: 'countries/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Country'],
    }),
    updateCountry: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `countries/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Country', id }, 'Country'],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `countries/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Country'],
    }),

    // Education Levels
    getEducationLevels: builder.query({
      query: (params = {}) => ({
        url: 'education-levels/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['EducationLevel'],
    }),
    getEducationLevel: builder.query({
      query: (id) => `education-levels/${id}/`,
      providesTags: (result, error, id) => [{ type: 'EducationLevel', id }],
    }),
    createEducationLevel: builder.mutation({
      query: (data) => ({
        url: 'education-levels/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EducationLevel'],
    }),
    updateEducationLevel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `education-levels/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EducationLevel', id }, 'EducationLevel'],
    }),
    deleteEducationLevel: builder.mutation({
      query: (id) => ({
        url: `education-levels/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EducationLevel'],
    }),

    // Schools
    getSchools: builder.query({
      query: (params = {}) => ({
        url: 'schools/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['School'],
    }),
    getSchool: builder.query({
      query: (id) => `schools/${id}/`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),
    createSchool: builder.mutation({
      query: (data) => ({
        url: 'schools/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['School'],
    }),
    updateSchool: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `schools/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'School', id }, 'School'],
    }),
    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `schools/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
    }),

    // Faculties
    getFaculties: builder.query({
      query: (params = {}) => ({
        url: 'faculties/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['Faculty'],
    }),
    getFaculty: builder.query({
      query: (id) => `faculties/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Faculty', id }],
    }),
    createFaculty: builder.mutation({
      query: (data) => ({
        url: 'faculties/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Faculty'],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `faculties/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faculty', id }, 'Faculty'],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `faculties/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faculty'],
    }),

    // Class Levels
    getClassLevels: builder.query({
      query: (params = {}) => ({
        url: 'class-levels/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['ClassLevel'],
    }),
    getClassLevel: builder.query({
      query: (id) => `class-levels/${id}/`,
      providesTags: (result, error, id) => [{ type: 'ClassLevel', id }],
    }),
    createClassLevel: builder.mutation({
      query: (data) => ({
        url: 'class-levels/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ClassLevel'],
    }),
    updateClassLevel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `class-levels/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ClassLevel', id }, 'ClassLevel'],
    }),
    deleteClassLevel: builder.mutation({
      query: (id) => ({
        url: `class-levels/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ClassLevel'],
    }),
    reorderClassLevels: builder.mutation({
      query: (data) => ({
        url: 'class-levels/reorder/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ClassLevel'],
    }),

    // Programs
    getPrograms: builder.query({
      query: (params = {}) => ({
        url: 'programs/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['Program'],
    }),
    getProgram: builder.query({
      query: (id) => `programs/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Program', id }],
    }),
    createProgram: builder.mutation({
      query: (data) => ({
        url: 'programs/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Program'],
    }),
    updateProgram: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `programs/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Program', id }, 'Program'],
    }),
    deleteProgram: builder.mutation({
      query: (id) => ({
        url: `programs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Program'],
    }),

    // Curricula
    getCurricula: builder.query({
      query: (params = {}) => ({
        url: 'curricula/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['Curriculum'],
    }),
    // Get curricula by program (public endpoint)
    getCurriculaByProgram: builder.query({
      queryFn: async (programId) => {
        const token = localStorage.getItem('admin_access_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(
          `${API_BASE_URL}/education/programs/${programId}/curricula/`,
          {
            method: 'GET',
            headers,
          }
        );
        
        if (!response.ok) {
          return {
            error: {
              status: response.status,
              data: await response.json().catch(() => ({ message: 'Failed to fetch curricula' })),
            },
          };
        }
        
        const data = await response.json();
        return { data: transformArrayResponse(data) };
      },
      providesTags: (result, error, programId) => [{ type: 'Curriculum', id: `program-${programId}` }],
    }),
    getCurriculum: builder.query({
      query: (id) => `curricula/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Curriculum', id }],
    }),
    createCurriculum: builder.mutation({
      query: (data) => ({
        url: 'curricula/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Curriculum'],
    }),
    updateCurriculum: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `curricula/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Curriculum', id }, 'Curriculum'],
    }),
    deleteCurriculum: builder.mutation({
      query: (id) => ({
        url: `curricula/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Curriculum'],
    }),

    // Subjects
    getSubjects: builder.query({
      query: (params = {}) => ({
        url: 'subjects/',
        params,
      }),
      transformResponse: transformArrayResponse,
      providesTags: ['Subject'],
    }),
    getSubject: builder.query({
      query: (id) => `subjects/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
    }),
    createSubject: builder.mutation({
      query: (data) => ({
        url: 'subjects/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `subjects/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Subject', id }, 'Subject'],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `subjects/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetEducationLevelsQuery,
  useGetEducationLevelQuery,
  useCreateEducationLevelMutation,
  useUpdateEducationLevelMutation,
  useDeleteEducationLevelMutation,
  useGetSchoolsQuery,
  useGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useGetFacultiesQuery,
  useGetFacultyQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetClassLevelsQuery,
  useGetClassLevelQuery,
  useCreateClassLevelMutation,
  useUpdateClassLevelMutation,
  useDeleteClassLevelMutation,
  useReorderClassLevelsMutation,
  useGetProgramsQuery,
  useGetProgramQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useGetCurriculaQuery,
  useGetCurriculaByProgramQuery,
  useGetCurriculumQuery,
  useCreateCurriculumMutation,
  useUpdateCurriculumMutation,
  useDeleteCurriculumMutation,
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = educationApi;

