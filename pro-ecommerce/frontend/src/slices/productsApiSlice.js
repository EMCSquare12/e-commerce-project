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
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductCategories: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductBrands: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/brands`,
      }),
      keepUnusedDataFor: 5,
    }),

  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useGetProductCategoriesQuery, useGetProductBrandsQuery } =
  productsApiSlice;
