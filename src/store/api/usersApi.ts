import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, UserEnrollment, UserProgress } from '../../interfaces/user';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const transformArrayResponse = <T>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  if (response?.results && Array.isArray(response.results)) return response.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
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
  tagTypes: ['User', 'UserEnrollment', 'UserProgress'],
  endpoints: (builder) => ({
    // Students
    getUsers: builder.query<User[], any>({
      query: (params = {}) => ({
        url: '/accounts/admin/students/',
        params,
      }),
      transformResponse: transformArrayResponse<User>,
      providesTags: ['User'],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/accounts/admin/students/${id}/`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/accounts/admin/students/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/accounts/admin/students/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Enrollments
    getUserEnrollments: builder.query<UserEnrollment[], string>({
      query: (userId) => `/accounts/admin/students/${userId}/enrollments/`,
      transformResponse: transformArrayResponse<UserEnrollment>,
      providesTags: ['UserEnrollment'],
    }),
    getUserExamEnrollments: builder.query<UserEnrollment[], string>({
      query: (userId) => `/accounts/admin/students/${userId}/exam-enrollments/`,
      transformResponse: transformArrayResponse<UserEnrollment>,
      providesTags: ['UserEnrollment'],
    }),
    getAllEnrollments: builder.query<UserEnrollment[], any>({
      query: (params = {}) => ({
        url: '/accounts/admin/enrollments/',
        params,
      }),
      transformResponse: transformArrayResponse<UserEnrollment>,
      providesTags: ['UserEnrollment'],
    }),

    // Progress (overall metrics - returns object)
    getUserProgress: builder.query<Record<string, any>, string>({
      query: (userId) => `/accounts/admin/students/${userId}/progress/`,
      providesTags: ['UserProgress'],
    }),
    // Course-specific progress (returns array)
    getUserCourseProgress: builder.query<UserProgress[], string>({
      query: (userId) => `/accounts/admin/students/${userId}/course-progress/`,
      transformResponse: transformArrayResponse<UserProgress>,
      providesTags: ['UserProgress'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserEnrollmentsQuery,
  useGetUserExamEnrollmentsQuery,
  useGetAllEnrollmentsQuery,
  useGetUserProgressQuery,
  useGetUserCourseProgressQuery,
} = usersApi;
