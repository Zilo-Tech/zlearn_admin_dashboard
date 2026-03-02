// src/store/api/aiCourseGenerationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  StartSessionRequest,
  StartSessionResponse,
  ChatRequest,
  ChatResponse,
  GenerateOutlineRequest,
  GenerateOutlineResponse,
  ApproveRequest,
  ApproveResponse,
  SessionDetailsResponse,
  CancelSessionResponse,
  ListSessionsResponse,
} from '../../interfaces/aiCourseGeneration';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const aiCourseGenerationApi = createApi({
  reducerPath: 'aiCourseGenerationApi',
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
  tagTypes: ['AICourseGenerationSession'],
  endpoints: (builder) => ({
    // Start a new session
    startSession: builder.mutation<StartSessionResponse, StartSessionRequest>({
      query: (data) => ({
        url: '/ai/generate-course/start/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        // Map 'id' to 'session_id' for consistency
        return {
          ...response,
          session_id: response.id || response.session_id,
        };
      },
      invalidatesTags: ['AICourseGenerationSession'],
    }),

    // Chat with AI
    chat: builder.mutation<ChatResponse, ChatRequest>({
      query: (data) => ({
        url: '/ai/generate-course/chat/',
        method: 'POST',
        body: {
          session_id: data.session_id,
          message: data.message,
        },
      }),
      transformResponse: (response: any) => {
        // Map 'id' to 'session_id' if present
        return {
          ...response,
          session_id: response.id || response.session_id,
        };
      },
      async onQueryStarted({ session_id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Refetch session details after chat
          dispatch(
            aiCourseGenerationApi.util.invalidateTags([
              { type: 'AICourseGenerationSession', id: session_id },
            ])
          );
        } catch {}
      },
    }),

    // Generate outline
    generateOutline: builder.mutation<GenerateOutlineResponse, GenerateOutlineRequest>({
      query: (data) => ({
        url: '/ai/generate-course/generate-outline/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ session_id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            aiCourseGenerationApi.util.invalidateTags([
              { type: 'AICourseGenerationSession', id: session_id },
            ])
          );
        } catch {}
      },
    }),

    // Approve and create course
    approveAndCreate: builder.mutation<ApproveResponse, ApproveRequest>({
      query: (data) => ({
        url: '/ai/generate-course/approve/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ session_id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            aiCourseGenerationApi.util.invalidateTags([
              { type: 'AICourseGenerationSession', id: session_id },
            ])
          );
        } catch {}
      },
    }),

    // Get session details
    getSession: builder.query<SessionDetailsResponse, string>({
      query: (sessionId) => `/ai/generate-course/session/${sessionId}/`,
      transformResponse: (response: any) => {
        // Map 'id' to 'session_id' for consistency
        return {
          ...response,
          session_id: response.id || response.session_id,
        };
      },
      providesTags: (result, error, sessionId) => [
        { type: 'AICourseGenerationSession', id: sessionId },
      ],
    }),

    // Cancel session
    cancelSession: builder.mutation<CancelSessionResponse, string>({
      query: (sessionId) => ({
        url: `/ai/generate-course/session/${sessionId}/cancel/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, sessionId) => [
        { type: 'AICourseGenerationSession', id: sessionId },
        'AICourseGenerationSession',
      ],
    }),

    // List all sessions
    listSessions: builder.query<ListSessionsResponse, void>({
      query: () => '/ai/generate-course/sessions/',
      transformResponse: (response: any) => {
        // Handle array response
        if (Array.isArray(response)) return response;
        if (response?.results && Array.isArray(response.results)) return response.results;
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ['AICourseGenerationSession'],
    }),
  }),
});

export const {
  useStartSessionMutation,
  useChatMutation,
  useGenerateOutlineMutation,
  useApproveAndCreateMutation,
  useGetSessionQuery,
  useCancelSessionMutation,
  useListSessionsQuery,
} = aiCourseGenerationApi;

