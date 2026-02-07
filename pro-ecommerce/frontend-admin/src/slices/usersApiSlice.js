import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`, // POST to /api/users
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        getUsers: builder.query({
            query: ({ keyword, status, pageNumber }) => ({
                params: { keyword, status, pageNumber },
                url: `${USERS_URL}/admin`,
            }),
            providesTags: ["Users"],
            keepUnusedDataFor: 5,
        }),
        getUserDetails: builder.query({
            query: ({ id, pageNumber, keyword }) => ({
                url: `${USERS_URL}/admin/customers/${id}`,
                params: { pageNumber, keyword }
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetUsersQuery,
    useGetUserDetailsQuery
} = usersApiSlice;