import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AlertTriangle, Trash2 } from "lucide-react";
import { setDeleteModal, setLoadingGlobal } from "../../slices/productSlice";
import { useDeleteProductMutation } from "../../slices/productsApiSlice";

const DeleteConfirmationModal = () => {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();
  const { deleteModal } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    dispatch(setLoadingGlobal(true));
    try {
      await deleteProduct(deleteModal.id).unwrap();
      toast.success("Product deleted successfully");
      dispatch(setDeleteModal({ open: false, id: null, name: "" }));
    } catch (err) {
      toast.error(err?.data?.message || "Error deleting product");
    } finally {
      dispatch(setLoadingGlobal(false));
    }
  };

  if (!deleteModal.open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity bg-slate-900/50 backdrop-blur-sm"
        onClick={() =>
          dispatch(setDeleteModal({ ...deleteModal, open: false }))
        }
      />

      {/* Modal Card */}
      <div className="relative w-full transition-all transform bg-white shadow-2xl sm:max-w-lg rounded-t-2xl sm:rounded-xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 fade-in">
        {/* Content Section */}
        <div className="p-6 sm:p-8">
          <div className="sm:flex sm:items-start">
            {/* Warning Icon */}
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full sm:mx-0 sm:h-12 sm:w-12 sm:mb-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            {/* Text Content */}
            <div className="text-center sm:ml-5 sm:text-left">
              <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                Delete {deleteModal.name || "Item"}?
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-relaxed text-gray-500">
                  Are you sure you want to delete this? All data associated with
                  this item will be
                  <span className="font-bold text-red-600">
                    {" "}
                    permanently removed
                  </span>
                  . This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5 bg-gray-50 sm:flex-row-reverse sm:px-8 rounded-b-xl pb-safe">
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white transition-all bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : <>Delete Permanently</>}
          </button>

          <button
            type="button"
            onClick={() =>
              dispatch(setDeleteModal({ ...deleteModal, open: false }))
            }
            disabled={isLoading}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
