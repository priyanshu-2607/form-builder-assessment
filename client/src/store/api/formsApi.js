import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const formsApi = createApi({
  reducerPath: 'formsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Form'],
  endpoints: (builder) => ({
    listForms: builder.query({
      query: () => '/api/forms',
      providesTags: (result) =>
        result
          ? [
              ...result.map((form) => ({ type: 'Form', id: form._id })),
              { type: 'Form', id: 'LIST' },
            ]
          : [{ type: 'Form', id: 'LIST' }],
    }),
    getForm: builder.query({
      query: (formId) => `/api/forms/${formId}`,
      providesTags: (result, error, formId) => [{ type: 'Form', id: formId }],
    }),
    createForm: builder.mutation({
      query: (payload) => ({
        url: '/api/forms',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
    updateForm: builder.mutation({
      query: ({ formId, payload }) => ({
        url: `/api/forms/${formId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { formId }) => [
        { type: 'Form', id: formId },
        { type: 'Form', id: 'LIST' },
      ],
    }),
    deleteForm: builder.mutation({
      query: (formId) => ({
        url: `/api/forms/${formId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
    submitForm: builder.mutation({
      query: ({ formId, values }) => ({
        url: `/api/forms/${formId}/submissions`,
        method: 'POST',
        body: values,
      }),
    }),
  }),
});

export const {
  useListFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useSubmitFormMutation,
} = formsApi;
