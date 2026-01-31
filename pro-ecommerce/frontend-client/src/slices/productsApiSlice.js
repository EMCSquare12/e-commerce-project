import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category, brand }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
          category,
          brand
        },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { pageNumber, ...rest } = queryArgs;
        return { endpointName, queryArgs: rest };
      },
      // Merge incoming products into the existing list
      merge: (currentCache, newItems) => {
        if (newItems.page === 1) {
          return newItems;
        }
        currentCache.products.push(...newItems.products);
        currentCache.page = newItems.page;
        currentCache.pages = newItems.pages;
      },
      // Refetch when the pageNumber changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductNavigation: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/navigation`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductCategories: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductBrands: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/brands`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    submitReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Product"],
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductCategoriesQuery,
  useGetProductBrandsQuery,
  useGetProductNavigationQuery,
  useSubmitReviewMutation,
} =
  productsApiSlice;
