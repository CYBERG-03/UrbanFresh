import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllPurchaseOrders, confirmDeliveryAndStock } from '../../services/adminPurchaseOrderService';

/**
 * Controller Layer - Basic Admin Page to view and create purchase orders.
 */
export default function AdminPurchaseOrdersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple state for creating a quick PO from URL state
  const [brandId, setBrandId] = useState(location.state?.brandId || '');
  const [productId, setProductId] = useState(location.state?.productId || '');
  const [quantity, setQuantity] = useState(50);
  const [creating, setCreating] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState(null);
  const [viewReason, setViewReason] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllPurchaseOrders();
      setOrders(data);
    } catch {
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createPurchaseOrder({
        brandId: Number(brandId),
        items: [{ productId: Number(productId), quantity: Number(quantity) }]
      });
      toast.success('Purchase order created successfully!');
      loadOrders();
      setBrandId('');
      setProductId('');
      setQuantity(50);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create PO');
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmOrderId) return;
    try {
      await confirmDeliveryAndStock(confirmOrderId);
      toast.success('Stock updated successfully!');
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm delivery');
    } finally {
      setConfirmOrderId(null);
    }
  };

  const handleConfirm = (orderId) => {
    setConfirmOrderId(orderId);
  };

  const th = "px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs";
  const td = "px-4 py-3 text-gray-700 border-t border-gray-100";

  // Filter orders with notices
  const noticedOrders = orders.filter(
    (order) => order.status === "CANCELLED" && order.supplierNotice
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {confirmOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-sm shadow-2xl transform transition-all duration-300 scale-100">
            <div className="mb-4 text-center">
              <svg className="mx-auto mb-4 text-amber-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Confirm Action</h3>
              <p className="text-gray-500 text-sm">Are you sure you want to mark this as completed and update stock?</p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200"
                onClick={() => setConfirmOrderId(null)}
              >
                No, cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
                onClick={handleConfirmAction}
              >
                Yes, complete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl border border-gray-200 p-0 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Rejection Rationale
              </h3>
              <button onClick={() => setViewReason(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 text-gray-700 border border-gray-200 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                {viewReason}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                  onClick={() => setViewReason(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between bg-white p-6 rounded-lg shadow items-center">
          <h1 className="text-2xl font-bold text-gray-800">Supplier Purchase Orders</h1>
          <div className="space-x-4">
            <button onClick={() => navigate('/admin')} className="text-blue-600 hover:underline text-sm font-medium">Dashboard</button>
            <button onClick={() => navigate('/admin/inventory')} className="text-blue-600 hover:underline text-sm font-medium">Inventory</button>
          </div>
        </div>

        {noticedOrders.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Supplier Notices Available</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {noticedOrders.map((order) => (
                      <li key={`notice-${order.id}`}>
                        <span className="font-semibold">Order #{order.id} ({order.brandName}):</span> {order.supplierNotice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listing */}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
             <p className="p-6 text-gray-500">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="p-6 text-gray-500">No purchase orders found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className={th}>ID</th>
                  <th className={th}>Brand Name</th>
                  <th className={th}>Items</th>
                  <th className={th}>Status</th>
                  <th className={th}>Est Delivery</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className={td}>#{order.id}</td>
                    <td className={td}>{order.brandName}</td>
                    <td className={td}>{order.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}</td>
                    <td className={td}>
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status==="DELIVERED"?"bg-blue-100 text-blue-800":order.status==="COMPLETED"?"bg-green-100 text-green-700":order.status==="PENDING"?"bg-yellow-100 text-yellow-700":order.status==="CANCELLED"?"bg-red-100 text-red-700":"bg-gray-100 text-gray-700"}`}>
                          {order.status}
                       </span>
                    </td>
                    <td className={td}>
                      {order.status === "COMPLETED" 
                        ? "Delivered" 
                        : (order.estimatedDeliveryTimeline || "—")}
                    </td>
                    <td className={td}>
                      {order.status === "DELIVERED" && (
                        <button onClick={() => handleConfirm(order.id)} className="text-xs bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-700 transition">
                          Confirm Delivery & Update Stock
                        </button>
                      )}
                      {order.status === "CANCELLED" && (
                        <div className="flex flex-col gap-2 relative group w-max">
                          <button onClick={() => setViewReason(order.rejectionReason || "No reason provided")} className="text-xs bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-1 hover:bg-gray-200 transition">
                            Rationale
                          </button>
                          {order.supplierNotice && (
                            <button onClick={() => {
                               setViewReason(`Supplier Notice:\n${order.supplierNotice}`);
                             }} 
                             className="absolute top-0 right-[-10px] w-3 h-3 bg-blue-500 rounded-full animate-pulse blur"
                             title="New Notice from Supplier">
                            </button>
                          )}
                          {order.supplierNotice && (
                             <button onClick={() => {
                               setViewReason(`Supplier Notice:\n${order.supplierNotice}`);
                             }} 
                             className="absolute top-0 right-[-10px] w-3 h-3 bg-blue-500 rounded-full"
                             title="New Notice from Supplier">
                             </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}



