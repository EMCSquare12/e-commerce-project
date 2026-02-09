import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Tag,
  Layers,
  Star,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetProductDetailsQuery,
  useGetProductOrderHistoryQuery,
  useGetProductDetailsNavigationQuery,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import OrderRow from "../components/OrderRow";
import Pagination from "../components/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { setProductPageNumber } from "../slices/productDetailsSlice";
import useClipboard from "../hooks/useClipboard";

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { copiedId, copyToClipboard } = useClipboard();

  const { pageNumber, keyword } = useSelector((state) => state.productDetails);

  // Fetch Product Info
  const {
    data: product,
    isLoading: loadingProduct,
    error: errorProduct,
  } = useGetProductDetailsQuery(id);

  // Fetch Navigation (Next/Prev IDs)
  const { data: navigation } = useGetProductDetailsNavigationQuery(id);

  // Fetch Order History for this Product
  const {
    data: ordersRaw,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetProductOrderHistoryQuery({ productId: id, pageNumber, keyword });

  // Add Keyboard support (Left/Right arrow keys)
  useEffect(() => {
    const handleArrowKey = (e) => {
      if (e.key === "ArrowRight" && navigation?.next) {
        navigate(`/admin/products/${navigation.next._id}`);
      }
      if (e.key === "ArrowLeft" && navigation?.prev) {
        navigate(`/admin/products/${navigation.prev._id}`);
      }
    };
    window.addEventListener("keydown", handleArrowKey);
    return () => window.removeEventListener("keydown", handleArrowKey);
  }, [navigation, navigate]);

  const toggleRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loadingProduct || loadingOrders) return <Loader />;

  if (errorProduct)
    return (
      <div className="p-4">
        <Message variant="danger">
          {errorProduct?.data?.message || "Product not found"}
        </Message>
      </div>
    );

  // Pagination Logic
  const itemsPerPage = 10;
  const totalOrders = ordersRaw?.orders?.length || 0;
  const pages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = ordersRaw?.orders?.slice(startIndex, endIndex) || [];

  return (
    <div className="max-w-6xl pb-20 mx-auto space-y-6 md:pb-8">
      {/* Navigation Header: Aligns Back button and Nav arrows in one row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors w-fit hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>

        {/* Next/Prev Button Group */}
        <div className="flex items-center gap-2">
          {navigation?.prev ? (
            <Link
              to={`/admin/products/${navigation.prev._id}`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
              title="Previous Product"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Link>
          ) : (
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed"
              disabled
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
          )}

          {navigation?.next ? (
            <Link
              to={`/admin/products/${navigation.next._id}`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
              title="Next Product"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed"
              disabled
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {/* Product Profile Card */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
            {product.image?.[0] ? (
              <img
                src={product.image[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <Package className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-slate-800">
                {product.name}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${
                  product.countInStock > 0
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="font-medium">SKU:</span> {product.sku || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Brand:</span> {product.brand}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <p className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase">
              <DollarSign className="w-3 h-3" /> Price
            </p>
            <p className="text-xl font-bold text-slate-800">
              ${product.price?.toFixed(2)}
            </p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <p className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase">
              <Package className="w-3 h-3" /> Stock Level
            </p>
            <p className="text-xl font-bold text-slate-800">
              {product.countInStock}{" "}
              <span className="text-sm font-medium text-gray-500">units</span>
            </p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <p className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase">
              <Star className="w-3 h-3" /> Rating
            </p>
            <p className="text-xl font-bold text-slate-800">
              {product.rating}{" "}
              <span className="text-sm font-medium text-gray-500">/ 5</span>
            </p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <p className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase">
              <ShoppingBag className="w-3 h-3" /> Orders Found
            </p>
            <p className="text-xl font-bold text-slate-800">{totalOrders}</p>
          </div>
        </div>
      </div>
      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Order History containing this item
        </h2>

        {paginatedOrders.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-200 border-dashed rounded-xl">
            <p className="text-gray-500">
              No orders found for this product yet.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="hidden border-b border-gray-200 bg-gray-50 md:table-header-group">
                  <tr>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Address
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-xs font-bold tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => {
                    const id = order.orderId || order._id || "";
                    return (
                      <OrderRow
                        key={id}
                        order={order}
                        isExpanded={expandedOrderId === id}
                        onToggle={() => toggleRow(id)}
                        copiedId={copiedId}
                        onCopy={copyToClipboard}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  page={pageNumber}
                  pages={pages}
                  setItemPages={(page) => dispatch(setProductPageNumber(page))}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsScreen;
