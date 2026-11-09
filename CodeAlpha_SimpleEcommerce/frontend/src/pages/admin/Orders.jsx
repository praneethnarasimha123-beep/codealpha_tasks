
import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import "./Orders.css";

const API_URL = "http://localhost:8000";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/orders`);
      const data = response.data;

      if (Array.isArray(data?.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Orders Fetch Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // STATUS UPDATE HANDLER (/api/orders/:id/status)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await axios.put(`${API_URL}/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Update State Locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          (order._id || order.id) === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error?.response?.data || error);
      alert(
        `Failed to update status: ${
          error?.response?.data?.message || "Server Error"
        }`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatus = (order) => order?.status || "Pending";

  const getCustomerName = (order) =>
    order?.customerName ||
    order?.user?.name ||
    order?.customer?.name ||
    "Customer";

  const getCustomerEmail = (order) =>
    order?.email || order?.user?.email || "No email";

  const getItemsCount = (order) => order?.items?.length || 0;

  const getTotal = (order) => {
    const val =
      order?.totalAmount ??
      order?.total ??
      order?.amount ??
      order?.subTotal ??
      0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const getStatusClass = (status) =>
    `op-status-${status.toLowerCase().replace(/\s+/g, "-")}`;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = getCustomerName(order);
      const email = getCustomerEmail(order);
      const orderId = order?._id || order?.id || "";

      const matchesSearch =
        customer.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        orderId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        getStatus(order).toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const { pendingOrders, processingOrders, deliveredOrders, totalRevenue } =
    useMemo(() => {
      return orders.reduce(
        (acc, order) => {
          const status = getStatus(order).toLowerCase();
          if (status === "pending") acc.pendingOrders += 1;
          if (status === "processing") acc.processingOrders += 1;
          if (status === "delivered") acc.deliveredOrders += 1;
          acc.totalRevenue += getTotal(order);
          return acc;
        },
        {
          pendingOrders: 0,
          processingOrders: 0,
          deliveredOrders: 0,
          totalRevenue: 0,
        }
      );
    }, [orders]);

  return (
    <div className="op-page">
      <div className="op-container">
        {/* HEADER */}
        <div className="op-header">
          <div>
            <div className="op-eyebrow">
              <span></span>
              ADMIN PANEL <b>/</b> ORDERS
            </div>
            <h1>
              Order <span>Management</span>
            </h1>
            <p>
              Monitor customer orders, revenue and fulfillment status from one dashboard.
            </p>
          </div>

          <button className="op-refresh-button" onClick={fetchOrders}>
            <span>↻</span> Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="op-stats">
          <div className="op-stat-card">
            <div className="op-stat-icon op-purple">#</div>
            <div>
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
              <small>All orders</small>
            </div>
          </div>

          <div className="op-stat-card">
            <div className="op-stat-icon op-orange">◷</div>
            <div>
              <span>Pending</span>
              <strong>{pendingOrders}</strong>
              <small className="op-orange-text">Awaiting action</small>
            </div>
          </div>

          <div className="op-stat-card">
            <div className="op-stat-icon op-blue">◇</div>
            <div>
              <span>Processing</span>
              <strong>{processingOrders}</strong>
              <small className="op-blue-text">Being prepared</small>
            </div>
          </div>

          <div className="op-stat-card">
            <div className="op-stat-icon op-green">✓</div>
            <div>
              <span>Delivered</span>
              <strong>{deliveredOrders}</strong>
              <small className="op-green-text">Successfully delivered</small>
            </div>
          </div>
        </div>

        {/* REVENUE BAR */}
        <div className="op-revenue">
          <div className="op-revenue-left">
            <div className="op-revenue-icon">$</div>
            <div>
              <span>TOTAL REVENUE</span>
              <strong>
                $
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>

          <div className="op-live">
            <i></i> LIVE DATA
          </div>
        </div>

        {/* ORDERS CARD */}
        <div className="op-main-card">
          <div className="op-card-header">
            <div className="op-card-title">
              <div className="op-title-line"></div>
              <div>
                <h2>Recent Orders</h2>
                <p>View and track customer purchases</p>
              </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="op-controls">
              <div className="op-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="op-clear-btn">
                    ×
                  </button>
                )}
              </div>

              <select
                className="op-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="op-table-container">
            {loading ? (
              <div className="op-loading">
                <div className="op-loader"></div>
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="op-empty">
                <div className="op-empty-icon">◇</div>
                <h3>
                  {search || statusFilter !== "All"
                    ? "No Matching Orders"
                    : "No Orders Yet"}
                </h3>
                <p>
                  {search || statusFilter !== "All"
                    ? "Try changing your search or filter."
                    : "Customer orders will appear here."}
                </p>
              </div>
            ) : (
              <div className="op-table-scroll">
                <table className="op-table">
                  <thead>
                    <tr>
                      <th>ORDER</th>
                      <th>CUSTOMER</th>
                      <th>ITEMS</th>
                      <th>TOTAL</th>
                      <th>CHANGE STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => {
                      const status = getStatus(order);
                      const customer = getCustomerName(order);
                      const itemsCount = getItemsCount(order);
                      const orderId = order._id || order.id;
                      const uniqueKey = orderId || `order-${index}`;

                      return (
                        <tr key={uniqueKey}>
                          <td>
                            <div className="op-order-id">
                              <span>#</span>
                              {(orderId || "").slice(-8).toUpperCase() || "N/A"}
                            </div>
                          </td>
                          <td>
                            <div className="op-customer">
                              <div className="op-avatar">
                                {customer.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong>{customer}</strong>
                                <small>{getCustomerEmail(order)}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="op-items">
                              {itemsCount}{" "}
                              {itemsCount === 1 ? "item" : "items"}
                            </span>
                          </td>
                          <td>
                            <strong className="op-total">
                              $
                              {getTotal(order).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </td>
                          <td>
                            <select
                              className={`op-filter ${getStatusClass(status)}`}
                              value={status}
                              disabled={updatingId === orderId}
                              onChange={(e) =>
                                handleStatusChange(orderId, e.target.value)
                              }
                              style={{ cursor: "pointer", fontWeight: "600" }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <span className="op-date">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* FOOTER */}
          {!loading && filteredOrders.length > 0 && (
            <div className="op-footer">
              <span>
                Showing <strong>{filteredOrders.length}</strong> of{" "}
                <strong>{orders.length}</strong> total orders
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;