import { PRODUCTS_URL } from "../constants"; // Assumes '/api/products'
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // --- READ: Get All Products (Admin Mode) ---
    getProducts: builder.query({
      query: () => ({
        // Append '/admin' to fetch the full list (active + drafts)
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
      query: () => ({
        url: `${PRODUCTS_URL}/admin`, // Matches router.route('/admin').post(...)
        method: "POST",
      }),
      invalidatesTags: ["Product"], // Forces the list to refresh automatically
    }),

    // --- UPDATE: Edit existing product ---
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"], // Refresh list after edit
    }),

    // --- DELETE: Remove product ---
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"], // Refresh list after delete
    }),

    // --- UPLOAD: Handle Image Uploads ---
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`, // You might need to create this route in backend
        method: "POST",
        body: data,
      }),
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
} = productsApiSlice;