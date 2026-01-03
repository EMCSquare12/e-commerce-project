import { PRODUCTS_URL } from "../constants"; // Assumes '/api/products'
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // --- READ: Get All Products (Admin Mode) ---
    getProducts: builder.query({
      query: ({ keyword, category, status, pageNumber }) => ({
        params: { keyword, category, status, pageNumber },
        url: `${PRODUCTS_URL}/admin`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    // --- READ: Get Single Product Details (For Edit Screen) ---
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // --- CREATE: Add a new product ---
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Product"],
    }),

    // --- UPDATE: Edit existing product ---
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data.formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // --- DELETE: Remove product ---
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"], 
    }),

    // --- UPLOAD: Handle Image Uploads ---
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: "POST",
        body: data,
      }),
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
    getProductStatus: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/status`,
      }),
      keepUnusedDataFor: 5,
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useGetProductCategoriesQuery,
  useGetProductBrandsQuery,
  useGetProductStatusQuery
} = productsApiSlice;